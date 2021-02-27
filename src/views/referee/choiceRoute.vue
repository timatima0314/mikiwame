<template>
  <div v-loading="loading">
    <el-card v-if="isFinishedAnswer">
      <p class="thanks">{{ refereeI18n.t('message.thankYouReferenceCheck') }}</p>
      <p>{{ refereeI18n.t('message.informationKeptInStrictConfidence') }}</p>
    </el-card>

    <el-card v-if="!isFinishedAnswer && isAfterDeadline">
      <p>{{ refereeI18n.t('message.deadlinePassed') }}</p>
    </el-card>
  </div>
</template>

<script>

import { refereePageMixin } from './mixin/refereePageMixin'

export default {
  name: 'RefereeFinished',
  mixins: [refereePageMixin],
  data() {
    return {
      isFinishedAnswer: false //  回答済みであるか
    }
  },
  async created() {
    await this.setup()

    // 回答済みかを判定
    if (this.referee.completedAt) this.isFinishedAnswer = true
    else {
      // 回答期限切れでは無い場合
      if (!this.isAfterDeadline) {
        // プライバシーポリシーに同意済みかを判定
        if (this.referee.isAgreeToPrivacyPolicy) this.$router.push({ name: 'refereeAuthentication', query: this.$route.query })
        else this.$router.push({ name: 'refereeInstruction', query: this.$route.query })
      }
    }
    this.toggleLoading()
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

