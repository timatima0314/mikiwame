<template>
  <div v-loading="loading">
    <el-card>
      <p v-html="commonI18n.t('message.boldHonorific', { name: referee.name })" />
      <p class="thanks">{{ refereeI18n.t('message.thankYouReferenceCheck') }}</p>
      <p>{{ refereeI18n.t('message.informationKeptInStrictConfidence') }}</p>
    </el-card>
  </div>
</template>

<script>
import { refereePageMixin } from './mixin/refereePageMixin'
import firebase from 'firebase/app'
import { completeReferenceCheck } from '@/utils/api/usecase/completeReferenceCheck.js'

export default {
  name: 'RefereeComplete',
  mixins: [refereePageMixin],
  // 完了済みの時は他画面に遷移させない
  beforeRouteLeave(to, from, next) {
    if (this.referee.completedAt) next(false)
    else next()
  },
  async created() {
    try {
      await this.setup()
      const { company: companyId, talent: talentId, token: refereeId } = this.$route.query
      // 完了画面の1度目の表示であるかを判断
      if (!this.referee.completedAt) {
        const user = firebase.auth().currentUser
        await completeReferenceCheck({
          uid: user.uid,
          companyId,
          talentId,
          refereeId
        })
      }
    } catch (err) {
      this.$notify({
        type: 'error',
        title: 'Error',
        message: this.notifyI18n.t('message.errorPleaseAgain')
      })
      this.$rollbar.error(err)
    } finally {
      this.toggleLoading()
    }
  }
}
</script>

<style lang="sass" scoped>
.thanks
  font-weight: bold
  font-size: 1.2rem
  color: #1a86f5
  text-align: center
</style>

