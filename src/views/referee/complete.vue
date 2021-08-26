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
import { TalentApi } from '@/utils/api/talent_api'
import { statusProperty } from '@/constants/status'
import firebase from 'firebase/app'

export default {
  name: 'RefereeComplete',
  mixins: [refereePageMixin],
  async created() {
    try {
      await this.setup()
      const { company: companyId, talent: talentId, token: refereeId } = this.$route.query
      // 完了画面の1度目の表示であるかを判断
      if (!this.referee.completedAt) {
        const user = firebase.auth().currentUser
        // 推薦者の電話番号をauthから削除
        user.delete().then(async() => {
          // 推薦者の解答完了日の登録と候補者のステータス更新
          await Promise.all([
            this._refereeApi.updateAll([{ id: refereeId, completedAt: new Date() }]),
            TalentApi({ companyId, talentId }).update({ status: statusProperty.refereesAnswered.key })
          ])
        }).catch((err) => {
          this.$notify({
            type: 'error',
            title: 'Error',
            message: this.notifyI18n.t('message.errorPleaseAuthenticateAgain')
          })
          this.$rollbar.error(err)
          this.$router.push({ name: 'refereeAuthentication', query: this.$route.query })
        })
      }
    } catch {
      this.$notify({
        type: 'error',
        title: 'Error',
        message: this.notifyI18n.t('message.errorPleaseAgain')
      })
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

