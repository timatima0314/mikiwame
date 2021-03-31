<template>
  <section class="login-page">
    <div class="login-container">
      <el-form
        v-show="signupStatus === SIGNUP_STATUSES.INPUT_PHONE_NUMBER"
        ref="form"
        v-model="form"
        :model="form"
        :rules="rules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">電話番号の登録</h3>
          <div class="text">
            <p>2段階認証によりセキュリティを高めるため</p>
            <p>アカウント：{{ email }}に電話番号を紐付けます</p>
            <p>SMSを受信できる電話番号をご入力ください</p>
          </div>
        </div>

        <el-form-item prop="tel">
          <el-input
            v-model="form.tel"
            placeholder="電話番号(ハイフンなし)"
            name="tel"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-button
          id="signup-button"
          :loading="loading"
          native-type="submit"
          type="primary"
          class="login-button"
          @click.native.prevent="sendVerificationCode"
        >認証コードを送る</el-button>
      </el-form>

      <el-form
        v-show="signupStatus === SIGNUP_STATUSES.INPUT_VERIFY_CODE"
        class="login-form"
        @submit.native.prevent="verifyCode"
      >
        <div class="title-container" style="margin-bottom: 1em">
          <span
            class="text"
          >{{ convertedPhoneNumber }}に認証コードを送信しました</span>
        </div>
        <el-form-item>
          <el-input v-model="verificationCode" placeholder="認証コード" />
        </el-form-item>
        <el-button
          :loading="loading"
          type="info"
          class="login-button login-button-secondary"
          @click="onClickBack"
        >電話番号を入力し直す</el-button>
        <el-button
          :loading="loading"
          type="primary"
          native-type="submit"
          style="margin: 10px 0 0 0"
          class="login-button"
        >確定</el-button>
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

const SIGNUP_STATUSES = {
  INPUT_PHONE_NUMBER: 'INPUT_PHONE_NUMBER',
  INPUT_VERIFY_CODE: 'INPUT_VERIFY_CODE'
}

export default {
  name: 'SignUpPhone',
  data() {
    return {
      signupStatus: SIGNUP_STATUSES.INPUT_PHONE_NUMBER,
      recaptchaVerifier: null,
      confirmationResult: null,
      currentUser: null,
      verificationCode: null,
      form: {
        tel: ''
      },
      email: '',
      loading: false,
      redirect: undefined
    }
  },
  computed: {
    SIGNUP_STATUSES: () => SIGNUP_STATUSES,
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
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        return this.$router.push({ name: 'clientLogin' })
      }
      this.email = user.email
    })
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'signup-button',
      { size: 'invisible' }
    )
  },
  methods: {
    onClickBack() {
      this.signupStatus = SIGNUP_STATUSES.INPUT_PHONE_NUMBER
    },
    async sendVerificationCode() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (valid === undefined) return

      this.loading = true
      const {
        data: { registered }
      } = await functions
        .httpsCallable('isPhoneNumberRegistered')({
          phoneNumber: this.form.tel
        })
        .catch((err) => {
          this.$rollbar.error(err)
          this.$message({
            message:
              'ネットワークエラーが発生しました。通信環境を確認したうえで再度お試しください。',
            type: 'error'
          })
          this.loading = false
        })

      if (registered) {
        this.$message({
          message: '電話番号が他のアカウントですでに登録されています',
          type: 'error'
        })
        this.loading = false
        return
      }

      firebase
        .auth()
        .signInWithPhoneNumber(
          formatPhoneNumber(this.form.tel),
          window.recaptchaVerifier
        )
        .then((confirmationResult) => {
          this.confirmationResult = confirmationResult
          this.signupStatus = SIGNUP_STATUSES.INPUT_VERIFY_CODE
        })
        .catch((err) => {
          if (err.code === 'auth/invalid-phone-number') {
            this.$message({
              message: '電話番号の形式が無効です',
              type: 'error'
            })
          } else {
            this.$rollbar.error(err)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    verifyCode() {
      this.loading = true
      const phoneCred = firebase.auth.PhoneAuthProvider.credential(
        this.confirmationResult.verificationId,
        this.verificationCode
      )
      firebase
        .auth()
        .currentUser.linkWithCredential(phoneCred)
        .then(({ user }) => {
          this.$notify({
            type: 'success',
            title: 'Success',
            message: '電話番号の登録に成功しました'
          })
          this.$store.dispatch('user/login', {
            user,
            isAdminLogin: false
          })
          this.$router.push({ name: 'companyIndex' })
        })
        .catch((err) => {
          this.$rollbar.error(err)
          const ERRORS = {
            'auth/credential-already-in-use':
              '電話番号が他のアカウントで使用されています',
            'auth/invalid-verification-code': '認証コードが違います'
          }
          this.$alert(
            ERRORS[err.code] ||
              'エラーが発生しました。通信環境を確認したうえで再度お試しください。',
            'エラー',
            {
              confirmButtonText: 'Close',
              type: 'error'
            }
          )
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
