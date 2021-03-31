<template>
  <div>
    <span @click="isModalOpen = true">
      <slot />
    </span>
    <el-dialog :visible.sync="isModalOpen" title="リセットメールを受け取る">
      <div class="container">
        <el-input
          v-model="email"
          placeholder="登録済みのメールアドレス"
          class="origin"
        />
        <el-button
          :loading="loading"
          type="primary"
          @click="sendPasswordResetEmail"
        >リセットメール送信</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'ResetPasswordModal',
  data: () => ({
    loading: false,
    isModalOpen: false,
    email: ''
  }),
  methods: {
    sendPasswordResetEmail() {
      this.loading = true
      firebase
        .auth()
        .sendPasswordResetEmail(this.email)
        .then(() => {
          this.$message({
            message: 'パスワード変更用のメールを送信しました。',
            type: 'success'
          })
        })
        .catch(() => {
          this.$message({
            message:
              'パスワード変更用のメールを送信に失敗しました。通信環境を確認したうえで再度お試しください。',
            type: 'error'
          })
        })
        .finally(() => {
          this.loading = false
          this.isModalOpen = false
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  width: 80%
  margin: auto
.origin
  margin-bottom: 1em
</style>
