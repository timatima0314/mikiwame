<template>
  <section class="login-page">
    <div class="login-container">
      <el-form v-show="loginStatus === LOGIN_STATUSES.MAIL_LOGIN" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" style="background-color: #fff; padding: 30px;">
        <div style="text-align: center">
          <img src="@/assets/logo.png" style="width: 100%;">
          <router-link :to="{name: 'signup'}" class="link-color-primary">新規会員登録はこちら</router-link>
          <br><br>
          <router-link :to="{name: 'signup'}" class="link-color-primary">
            <el-button style="color:#fff; background-color:#e371a3; line-height: 150%; width: 50%; padding: 6px 20px;"><b>今すぐ10日間<br>無料でお試し</b></el-button>
          </router-link>
        </div>

        <el-form-item prop="email">
          <span class="label">メールアドレス</span>
          <!-- TODO: firebaseとcookie周りの保存処理を書く必要があるため、後回し -->
          <!-- <span class="label link-color-light">{{cachedLoginInfoCount}}件の保存されたユーザー名</span> -->
          <el-input
            ref="email"
            v-model="loginForm.email"
            placeholder="メールアドレスを入力してください"
            name="email"
            :tabindex="loginStatus === LOGIN_STATUSES.MAIL_LOGIN ? '1' : '-1'"
            type="text"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="label">パスワード</span>
          <reset-password-modal class="forgot" />
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="パスワードを入力してください"
            name="password"
            :tabindex="loginStatus === LOGIN_STATUSES.MAIL_LOGIN ? '2' : '-1'"
            auto-complete="on"
            @keyup.enter.native="handleMailLogin"
          />
        </el-form-item>

        <el-button :loading="loading" class="login-button" @click.native.prevent="handleMailLogin">ログイン</el-button>
        <el-checkbox v-model="willPersistLogin" style="margin-top: 1rem">ログイン状態を保持する</el-checkbox>
        <div class="actions-container login-info">
          <reset-password-modal class="forgot">
            <a href="javascript:void(0)" class="link-color-light">パスワードをお忘れですか?</a>
          </reset-password-modal>
          <router-link :to="{name: isAdminLogin ? 'clientLogin' : 'adminLogin'}" class="link-color-primary" style="float: right">
            {{ isAdminLogin ? 'お客様はこちら' : '管理者の方はこちら' }}
          </router-link>
        </div>
      </el-form>

      <el-form v-show="loginStatus === LOGIN_STATUSES.PHONE_LOGIN" class="login-form" @submit.native.prevent="handlePhoneLogin">
        <div class="title-container" style="margin-bottom: 1em;">
          <span class="text">{{ convertedPhoneNumber }}に認証コードを送信しました</span>
        </div>
        <el-form-item prop="tel">
          <el-input
            v-model="loginForm.verificationCode"
            placeholder="認証コード"
            name="verificationCode"
            type="number"
            :tabindex="loginStatus === LOGIN_STATUSES.PHONE_LOGIN ? '1' : '-1'"
            auto-complete="on"
          />
        </el-form-item>
        <el-button :loading="loading" type="primary" native-type="submit" class="login-button">確定</el-button>
        <div style="height: 1rem" />
        <el-button :loading="loading" type="info" class="login-button login-button-secondary" @click="onClickBack">ログイン画面に戻る</el-button>
      </el-form>
      <div id="recaptcha" />
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import { mapGetters } from 'vuex'
import { hasAdminAuth } from '@/utils/auth'
import { normalizePhoneNumber, anonymizePhoneNumber } from '@/utils/phone'
import { emailRules, passwordRules } from '@/constants/validation'
import ResetPasswordModal from '@/components/ResetPasswordModal'
import { useCompany, updateCompany } from '@/utils/hooks/firestore'
import get from 'lodash/get'
import { isTrial } from '@/utils/isTrial'

const LOGIN_STATUSES = { MAIL_LOGIN: 'MAIL_LOGIN', PHONE_LOGIN: 'PHONE_LOGIN' }

export default {
  name: 'Login',
  components: { ResetPasswordModal },
  data() {
    return {
      loginForm: {
        email: '',
        verificationCode: '',
        password: ''
      },
      willPersistLogin: false, // ログイン状態を保持するか
      loginStatus: LOGIN_STATUSES.MAIL_LOGIN,
      phoneNumber: '',
      confirmationResult: null,
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    LOGIN_STATUSES: () => LOGIN_STATUSES,
    loginRules: () => ({
      email: emailRules,
      password: passwordRules
    }),
    isAdminLogin() {
      return this.$route.name === 'adminLogin'
    },
    convertedPhoneNumber() {
      return anonymizePhoneNumber(normalizePhoneNumber(this.phoneNumber))
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
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', { size: 'invisible', tabindex: '-1' })
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
    onClickBack() {
      firebase.auth().signOut()
      this.loginStatus = LOGIN_STATUSES.MAIL_LOGIN
    },
    async handleMailLogin() {
      const valid = await this.$refs.loginForm.validate().catch(() => {})
      if (!valid) return

      this.loading = true
      await firebase.auth().setPersistence(this.willPersistLogin ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION)
      firebase.auth().signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password)
        .then(async({ user }) => {
          if (this.isAdminLogin && await hasAdminAuth(user.uid) === false) {
            firebase.auth().signOut()
            throw new Error('you do not have admin auth')
          }

          if (!user.phoneNumber) {
            // 電話番号が未登録であれば、登録画面へ
            return this.$router.push({ name: 'signupPhone' })
          }

          this.$message.success('認証コードを送信中です')
          this.phoneNumber = user.phoneNumber
          firebase.auth().signInWithPhoneNumber(this.phoneNumber, window.recaptchaVerifier)
            .then(confirmationResult => {
              this.confirmationResult = confirmationResult
              this.loginStatus = LOGIN_STATUSES.PHONE_LOGIN
              this.$nextTick(() => {
                this.loading = false
              })
            })
            .catch(err => {
              this.$rollbar.error(err)
              this.$alert('時間をおいて再度お試しください', '認証コードの送信に失敗しました')
              this.loading = false
            })
        })
        .catch(err => {
          this.$rollbar.error(err)
          this.$alert('アカウントが登録されていないか、権限がありません', 'ログインに失敗しました', {
            confirmButtonText: 'Close',
            type: 'warning'
          })
          this.loading = false
        })
    },
    async handlePhoneLogin() {
      this.loading = true
      const { user } = await this.confirmationResult.confirm(this.loginForm.verificationCode).catch(() => ({}))
      if (user === undefined) {
        this.loading = false
        return this.$message.error('認証コードが違います')
      }
      this.$store.dispatch('user/login', {
        user,
        isAdminLogin: this.isAdminLogin
      }).then(async() => {
        const companyId = this.$store.getters['companyId']
        const { companyData } = await useCompany({ companyId: companyId })

        // Mikiwameを利用可能なユーザーであればtrue
        const isAvailableMikiwame = (() => {
          const isCardValid = get(companyData, 'creditCard.valid')
          // 認証されていて、かつ、試用期間又はカード登録済み であれば利用可能
          return companyData.verifiedAt && (isTrial(companyData) || isCardValid)
        })()

        // 管理者 又は Mikiwameを利用可能なアカウントであればloginCountをインクリメントする
        if (this.isAdmin || isAvailableMikiwame) {
          // 初回ログインポップの表示を消した際にloginCountは-1となるため、その場合は次のloginCountを2とする
          if (companyData.loginCount === -1) {
            updateCompany({ companyId: companyId, data: { loginCount: 2 }}).catch(() => {})
          } else {
            updateCompany({ companyId: companyId, data: { loginCount: companyData.loginCount + 1 }}).catch(() => {})
          }
        }
        this.$router.push(this.redirect || '/')
      })
        .catch(err => {
          this.$rollbar.error(err)
          this.$message.error('通信エラーが発生しました。時間をおいて再度お試しください')
          this.loading = false
          this.onClickBack()
        })
    }
  }
}
</script>

