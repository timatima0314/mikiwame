<template>
  <section class="login-page">
    <div class="login-container">
      <el-form
        v-show="status === STATUSES.INPUT_PHONE_NUMBER"
        ref="form"
        v-model="form"
        v-loading="loading"
        :model="form"
        :rules="rules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">
            {{ refereeI18n.t("message.registeringPhoneNumber") }}
          </h3>
          <div class="text">
            <p>{{ refereeI18n.t("message.toIncreaseSecurity") }}</p>
            <p>{{ refereeI18n.t("message.pleaseRegisteringPhoneNumber") }}</p>
          </div>
        </div>

        <el-form-item prop="tel">
          <el-input
            v-model="form.tel"
            :placeholder="commonI18n.t('message.phoneNumber')"
            name="tel"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-button
          id="referee-authentication-button"
          :loading="loading"
          native-type="submit"
          type="primary"
          class="login-button"
          @click.native.prevent="phoneNumberRegistration"
        >{{ refereeI18n.t("message.sendCode") }}</el-button>
      </el-form>

      <el-form
        v-show="status === STATUSES.INPUT_VERIFY_CODE"
        v-loading="loading"
        class="login-form"
        @submit.native.prevent="verifyCode"
      >
        <div class="title-container" style="margin-bottom: 1em">
          <span class="text">{{
            refereeI18n.t("message.codeHasBeenSent", {
              phoneNumber: convertedPhoneNumber,
            })
          }}</span>
        </div>
        <el-form-item>
          <el-input
            v-model="verificationCode"
            :placeholder="refereeI18n.t('message.authenticationCode')"
          />
        </el-form-item>
        <div v-if="isBeforeRegisteringPhone">
          <el-button
            :loading="loading"
            type="info"
            class="login-button login-button-secondary"
            @click="onClickBack"
          >{{ refereeI18n.t("message.reEnterNumber") }}</el-button>
        </div>
        <el-button
          :loading="loading"
          type="primary"
          native-type="submit"
          style="margin: 10px 0 0 0"
          class="login-button"
        >{{ commonI18n.t("message.confirm") }}</el-button>
      </el-form>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import {
  formatPhoneNumber,
  normalizePhoneNumber,
  anonymizePhoneNumber
} from '@/utils/phone'
import { functions } from '@/plugins/firebase'
import { telRules } from '@/constants/validation'
import { RefereeApi } from '@/utils/api/referee_api'
import { refereePageMixin } from './mixin/refereePageMixin'

const STATUSES = {
  INPUT_PHONE_NUMBER: 'INPUT_PHONE_NUMBER',
  INPUT_VERIFY_CODE: 'INPUT_VERIFY_CODE'
}

export default {
  name: 'Authentication',
  mixins: [refereePageMixin],
  data() {
    return {
      status: STATUSES.INPUT_PHONE_NUMBER,
      recaptchaVerifier: null,
      confirmationResult: null,
      currentUser: null,
      verificationCode: null,
      form: {
        tel: ''
      },
      email: '',
      redirect: undefined,
      isBeforeRegisteringPhone: true // 電話番号登録前であるか
    }
  },
  computed: {
    STATUSES: () => STATUSES,
    rules: () => ({ tel: telRules }),
    convertedPhoneNumber() {
      return anonymizePhoneNumber(normalizePhoneNumber(this.form.tel))
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  async created() {
    await this.setup()

    // 回答済み,又は期限切れであれば認証させない(URLを書き換えてページに飛んできたことを想定)
    if (this.referee.completedAt || this.isAfterDeadline) {
      this.$router.push({
        name: 'refereeChoiceRoute',
        query: this.$route.query
      })
    } else if (this.referee.phoneNumber) {
      // 既に電話番号の登録が行われているが回答は完了していない場合
      this.status = STATUSES.INPUT_VERIFY_CODE
      this.isBeforeRegisteringPhone = false
      this.form.tel = this.referee.phoneNumber
      this.sendVerificationCode()
    }
    this.toggleLoading()
  },
  mounted() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'referee-authentication-button',
      { size: 'invisible' }
    )
  },
  methods: {
    onClickBack() {
      this.status = STATUSES.INPUT_PHONE_NUMBER
    },
    async phoneNumberRegistration() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (valid === undefined) return

      this.loading = true
      const {
        data: { registered }
      } = await functions
        .httpsCallable('isRefereePhoneNumberRegistered')({
          phoneNumber: this.form.tel
        })
        .catch((err) => {
          this.$rollbar.error(err)
          this.$message({
            message: this.notifyI18n.t('message.errorPhoneRegisteredCheck'),
            type: 'error'
          })
          this.loading = false
        })

      // <!--authに登録済み-->，又は候補者の電話番号と同一，又は既に登録済みの推薦者の電話番号と同一，の場合は弾く
      if (
        registered ||
        this.talent.phoneNumber === this.form.tel ||
        this.refereesPhoneNumber.includes(this.form.tel)
      ) {
        this.$message({
          message: this.refereeI18n.t('message.numberIsAlreadyRegistered'),
          type: 'error'
        })
        this.loading = false
        return
      }
      this.sendVerificationCode()
    },
    sendVerificationCode() {
      firebase
        .auth()
        .signInWithPhoneNumber(
          formatPhoneNumber(this.form.tel),
          window.recaptchaVerifier
        )
        .then((confirmationResult) => {
          this.confirmationResult = confirmationResult
          this.status = STATUSES.INPUT_VERIFY_CODE
        })
        .catch((err) => {
          if (err.code === 'auth/invalid-phone-number') {
            this.$message({
              message: this.refereeI18n.t('message.invalidNumber'),
              type: 'error'
            })
          } else {
            this.$message({
              message: this.notifyI18n.t('message.errorSmsAuthentication', {
                message: err.code
              }),
              type: 'error'
            })
            this.$rollbar.error(err)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    async verifyCode() {
      this.loading = true
      await this.confirmationResult
        .confirm(this.verificationCode)
        .then(async(result) => {
          this.$notify({
            type: 'success',
            title: 'Success',
            message: this.refereeI18n.t('message.successfullyVerified')
          })
          const {
            company: companyId,
            talent: talentId,
            token: refereeId
          } = this.$route.query
          // 電話番号をfirestoreに記録
          await RefereeApi({ companyId, talentId, refereeId }).updateAll([
            { id: refereeId, phoneNumber: this.form.tel }
          ])
          this.$router.push({
            name: 'answerDescriptions',
            query: this.$route.query
          })
        })
        .catch((err) => {
          if (err.code === 'auth/invalid-verification-code') {
            this.$message({
              message: this.refereeI18n.t('message.wrongAuthorizationCode'),
              type: 'error'
            })
          } else {
            this.$message({
              message: this.notifyI18n.t('message.errorSmsAuthentication', {
                message: err.code
              }),
              type: 'error'
            })
            this.$rollbar.error(err)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    gotoNext() {
      this.descriptionsLength === 0
        ? this.$router.push({
          name: 'answerSelections',
          query: this.$route.query
        })
        : this.$router.push({
          name: 'answerDescriptions',
          query: this.$route.query
        })
    }
  }
}
</script>
