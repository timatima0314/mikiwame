<template>
  <section class="signup-page">
    <div class="login-container">
      <el-form
        ref="signupForm"
        :model="signupForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div style="text-align: center">
          <img src="@/assets/logo.png" style="width: 100%">
          <br>
          <router-link
            :to="{ name: 'clientLogin' }"
            class="link-color-primary"
          >ログインはこちら</router-link>
        </div>

        <el-form-item prop="email">
          <span class="label">メールアドレス</span>
          <el-input
            v-model="signupForm.email"
            placeholder="メールアドレスを入力してください"
            name="email"
            type="text"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="zipcode">
          <span class="label">郵便番号(ハイフンなしでご入力ください)</span>
          <el-input
            v-model="signupForm.zipcode"
            placeholder="例: 1070062"
            name="zipcode"
            type="number"
          >
            <template slot="prepend">〒</template>
          </el-input>
        </el-form-item>

        <el-form-item prop="address1">
          <span class="label">都道府県・市区町村・番地</span>
          <el-input
            v-model="signupForm.address1"
            name="address1"
            type="text"
            placeholder="例: 東京都港区南青山3丁目8番40号"
          />
        </el-form-item>

        <el-form-item prop="address2">
          <span class="label">ビル・マンション名</span>
          <el-input
            v-model="signupForm.address2"
            name="address2"
            type="text"
            placeholder="例: 青山センタービル2F"
          />
        </el-form-item>

        <el-form-item prop="companyName">
          <span class="label">会社名</span>
          <el-input
            v-model="signupForm.companyName"
            name="companyName"
            type="text"
            placeholder="会社名を入力してください"
          />
        </el-form-item>

        <el-form-item prop="staffName">
          <span class="label">氏名</span>
          <el-input
            v-model="signupForm.staffName"
            name="staffName"
            type="text"
            placeholder="お名前を入力してください"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="label">パスワード</span>
          <el-input
            :key="passwordType"
            v-model="signupForm.password"
            :type="passwordType"
            placeholder="パスワードを入力してください"
            name="password"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="confirmationPassword">
          <span class="label">パスワード(確認)</span>
          <el-input
            :key="passwordType"
            v-model="signupForm.confirmationPassword"
            :type="passwordType"
            placeholder="パスワードをもう一度入力してください"
            name="confirmationPassword"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="selectedPlan">
          <span class="label">プラン</span>
          <br>
          <el-radio-group v-model="signupForm.selectedPlan" type="default">
            <el-radio :label="PLANS.LIGHT">ライトプラン</el-radio>
            <el-radio :label="PLANS.STANDARD">スタンダードプラン</el-radio>
          </el-radio-group>
          <a
            href="https://hrrt.co.jp/price/"
            target="_blank"
            style="float: right"
          >料金はこちら<i
            class="el-icon-top-right"
          /></a>
        </el-form-item>

        <TermsOfService :agree.sync="agree" style="margin-bottom: 1rem" />

        <div class="actions-container">
          <el-button
            :loading="loading"
            type="primary"
            class="login-button"
            :disabled="!agree"
            @click.native.prevent="handleSignup"
          >新規登録</el-button>
        </div>
      </el-form>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import { mapGetters } from 'vuex'
import { emailRules, passwordRules } from '@/constants/validation'
import { functions, companiesCollectionRef } from '@/plugins/firebase'
import TermsOfService from './_terms_of_service'
import { PLANS } from '@/utils/payment'

export default {
  name: 'SignUp',
  components: { TermsOfService },
  data() {
    return {
      signupForm: {
        email: '',
        zipcode: null,
        address1: '',
        address2: '',
        companyName: '',
        staffName: '',
        password: '',
        confirmationPassword: '',
        selectedPlan: PLANS.LIGHT
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      agree: false
    }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    PLANS: () => PLANS,
    loginRules() {
      return {
        email: emailRules,
        companyName: [
          {
            required: true,
            trigger: 'blur',
            message: '会社名を入力してください'
          }
        ],
        staffName: [
          {
            required: true,
            trigger: 'blur',
            message: 'お名前を入力してください'
          }
        ],
        zipcode: [
          {
            required: true,
            trigger: 'blur',
            message: '郵便番号を入力してください'
          }
        ],
        address1: [
          {
            required: true,
            trigger: 'blur',
            message: 'ご住所を入力してください'
          }
        ],
        password: passwordRules
      }
    },
    isAdminLogin() {
      return this.$route.name === 'adminLogin'
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
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async handleSignup() {
      if (this.signupForm.password !== this.signupForm.confirmationPassword) {
        return this.$alert(
          '入力内容をお確かめください',
          'パスワードが一致しません',
          {
            confirmButtonText: 'Close',
            type: 'warning'
          }
        )
      }

      try {
        await this.$refs.signupForm.validate()
      } catch {
        return
      }

      this.loading = true
      // ユーザー登録とcompaniesコレクションの追加を行う
      const createUserResult = await firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .catch((err) => {
          this.loading = false
          this.$rollbar.error(err)
          if (err.code === 'auth/email-already-in-use') {
            this.$message({
              message: 'すでに登録済みのメールアドレスです',
              type: 'error'
            })
          }
        })
      if (createUserResult == null) return

      const { user } = createUserResult
      try {
        // 会社を登録する
        const companyDocumentRef = await companiesCollectionRef.add({
          uid: user.uid,
          name: this.signupForm.companyName,
          zipcode: this.signupForm.zipcode,
          address: this.signupForm.address2
            ? `${this.signupForm.address1} ${this.signupForm.address2}`
            : this.signupForm.address1,
          staffName: this.signupForm.staffName,
          email: this.signupForm.email,
          selectedPlan: this.signupForm.selectedPlan,
          createdAt: new Date(),
          isBusinessCardRequired: true,
          isFreemailAllowed: false,
          loginCount: 0
        })

        // 通知に失敗しても処理は止めないようにエラーを握りつぶす
        await functions
          .httpsCallable('notifyAdminClientSignup')({
            companyId: companyDocumentRef.id
          })
          .catch(() => {})
        this.$router.push({ name: 'signupPhone' })
      } catch (err) {
        this.$rollbar.error(err)
        this.loading = false
        // 会社の登録に失敗したら、新規登録をやり直せるようにユーザーを削除しておく
        this.$message({
          message:
            '登録に失敗しました。通信環境を確認したうえで再度お試しください。',
          type: 'error'
        })
        await user.delete()
      }
    }
  }
}
</script>
