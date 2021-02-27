<template>
  <div v-loading="loading" class="container">
    <el-card>
      <div style="text-align: center">
        <img src="@/assets/logo.png" style="width: 50%;">
        <center><p>ご利用いただき誠にありがとうございました。</p></center>
        <center><p>またのご利用をお待ちしております。</p></center>
        <center><p>頂いた貴重なご意見は、可能な限り、</p></center>
        <center><p>今後のシステムの改善に、反映させていただきます。</p></center>
      </div>

      <br>

      <div style="text-align: right">
        <p>株式会社HRRT</p>
        <p style="margin-top: -10px">MiKiWaMe&nbsp;Point事務局</p>
      </div>
      <el-button @click="onClickBack">
        <i class="el-icon-back" />
        ログインページ
      </el-button>
    </el-card>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'WithdrawalComplete',
  data: () => ({
    loading: true,
    name: null
  }),
  async created() {
    this.loading = false
    firebase.auth().signOut()
  },
  methods: {
    onClickBack() {
      this.$router.push({ name: 'clientLogin', query: this.$route.query })
    }
  }
}
</script>
