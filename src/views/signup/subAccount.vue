<template>
  <section class="login-page">
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

        <el-form-item prop="password">
          <span class="label">パスワード</span>
          <el-input
            v-model="signupForm.password"
            type="password"
            placeholder="パスワードを入力してください"
            name="password"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="confirmationPassword">
          <span class="label">パスワード(確認)</span>
          <el-input
            v-model="signupForm.confirmationPassword"
            type="password"
            placeholder="パスワードをもう一度入力してください"
            name="confirmationPassword"
            auto-complete="on"
          />
        </el-form-item>

        <div class="actions-container">
          <el-button
            :loading="loading"
            type="primary"
            class="login-button"
            @click.native.prevent="handleSignup"
          >新規登録</el-button>
        </div>
      </el-form>
    </div>
  </section>
</template>

<script>
import firebase from 'firebase/app'
import { emailRules, passwordRules } from '@/constants/validation'
import { functions } from '@/plugins/firebase'

export default {
  name: 'SubAccountSignUp',
  data() {
    return {
      signupForm: {
        email: '',
        password: '',
        confirmationPassword: ''
      },
      loading: false
    }
  },
  computed: {
    loginRules() {
      return {
        email: emailRules,
        password: passwordRules
      }
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

      const valid = await this.$refs.signupForm.validate().catch(() => {})
      if (valid === undefined) return
      this.loading = true
      // ユーザー登録とsubAccountsコレクションの追加を行う
      const { company: companyId, token: subAccountId } = this.$route.query
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(({ user }) => {
          // サブアカウントを登録する
          const updateData = {
            uid: user.uid,
            email: this.signupForm.email
          }
          Promise.all([
            functions.httpsCallable('pushToSubAccountUids')({
              companyId,
              uid: user.uid
            }),
            functions.httpsCallable('updateSubAccountByIds')({
              companyId,
              subAccountId,
              data: updateData
            })
          ])
            .then(async() => {
              await functions.httpsCallable('notifyAdminToSubAccountSignup')({
                companyId,
                subAccountId
              })
              this.$router.push({ name: 'signupSubAccountPhone' })
            })
            .catch(async(err) => {
              this.$rollbar.error(err)
              this.loading = false
              // サブアカウントの登録に失敗したら、新規登録をやり直せるようにユーザーを削除しておく
              this.$message({
                message:
                  '登録に失敗しました。通信環境を確認したうえで再度お試しください。',
                type: 'error'
              })
              await functions.httpsCallable('deleteFromSubAccountUids')({
                companyId,
                uid: user.uid
              })
              user.delete()
            })
        })
        .catch((err) => {
          this.$rollbar.error(err)
          this.loading = false
          if (err.code === 'auth/email-already-in-use') {
            this.$message({
              message: 'すでに登録済みのメールアドレスです',
              type: 'error'
            })
          }
        })
    }
  }
}
</script>
