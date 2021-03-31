<template>
  <div class="login-container">
    <el-form
      ref="form"
      class="login-form"
      :rules="rules"
      :model="form"
      @submit.native.prevent="resetPassword"
    >
      <div class="title-container">
        <h3 class="title">パスワードの再設定</h3>
      </div>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="form.password"
          type="password"
          placeholder="新しいパスワードを入力してください"
        />
      </el-form-item>

      <el-form-item prop="passwordConf">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="form.passwordConf"
          type="password"
          placeholder="確認のためもう一度ご入力ください"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        native-type="submit"
        style="width: 100%"
      >確定</el-button>
      <div style="text-align: center; padding: 1em; color: skyblue">
        <router-link
          :to="{ name: 'clientLogin' }"
        >ログインページに戻る</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'ResetPassword',
  data() {
    const matchPassword = (rule, value, callback) => {
      const { password, passwordConf } = this.form
      if (password === passwordConf) return callback()
      callback(new Error('パスワードが一致しません'))
    }
    return {
      loading: false,
      auth: {
        mode: '',
        oobCode: '',
        email: ''
      },
      form: {
        password: '',
        passwordConf: ''
      },
      rules: {
        password: [
          { min: 6, message: 'パスワードは6文字以上です', trigger: 'blur' }
        ],
        passwordConf: [{ validator: matchPassword, trigger: 'blur' }]
      }
    }
  },
  created() {
    const { query } = this.$route
    // メーラーによってはリンクの&がamp;にエスケープされてしまうのでそれを考慮
    this.auth.oobCode = query.oobCode || query['amp;oobCode']
    if (this.auth.oobCode === undefined) this.redirectToLogin()
    firebase
      .auth()
      .verifyPasswordResetCode(this.auth.oobCode)
      .then((email) => {
        this.auth.email = email
      })
      .catch((err) => {
        this.$rollbar.error(err)
        this.$message({
          message: 'リンクの有効期限が切れています',
          type: 'error'
        })
        this.redirectToLogin()
      })
  },
  methods: {
    redirectToLogin() {
      this.$router.push({ name: 'clientLogin' })
    },
    async resetPassword() {
      if (!(await this.$refs.form.validate())) return

      this.loading = true
      firebase
        .auth()
        .confirmPasswordReset(this.auth.oobCode, this.form.password)
        .then(() => {
          this.$message({
            message: 'パスワードの再設定に成功しました',
            type: 'success'
          })
          this.redirectToLogin()
        })
        .catch((err) => {
          this.$rollbar.error(err)
          this.$message({
            message:
              'パスワードの再設定に失敗しました。通信環境を確認したうえで再度お試しください。',
            type: 'error'
          })
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
