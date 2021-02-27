<template>
  <div v-loading="loading">
    <p v-html="commonI18n.t('message.boldHonorific', { name: referee.name })" />
    <p>{{ refereeI18n.t('message.instructionTitle', { honorific: commonI18n.t('message.honorific', { name: talent.name }) }) }}</p>

    <el-card class="mt-1">
      <h2>{{ commonI18n.t('message.aboutReferenceCheck') }}</h2>
      <div class="description">
        <p>{{ commonI18n.t('message.aboutReferenceCheckText1') }}</p>
        <p>{{ commonI18n.t('message.aboutReferenceCheckText2') }}</p>
      </div>

      <h2>{{ commonI18n.t('message.aboutMiKiWaMePoint') }}</h2>
      <div class="description">
        <p>{{ commonI18n.t('message.aboutMiKiWaMePointText1') }}</p>
        <p>{{ commonI18n.t('message.aboutMiKiWaMePointText2') }}</p>
      </div>

      <hr>

      <h2>{{ commonI18n.t('message.usageFlow') }}</h2>
      <el-steps direction="vertical" :active="3">
        <el-step :title="refereeI18n.t('message.personalRegistration')">
          <p slot="description" class="step-text">{{ refereeI18n.t('message.personalRegistrationText') }}</p>
        </el-step>
        <el-step :title="refereeI18n.t('message.questionnaireResponses')">
          <p slot="description" class="step-text">{{ refereeI18n.t('message.questionnaireResponsesText') }}</p>
        </el-step>
        <el-step :title="refereeI18n.t('message.personalConfirmation')">
          <p slot="description" class="step-text">{{ refereeI18n.t('message.personalConfirmationText') }}</p>
        </el-step>
      </el-steps>

      <Deadline :date="deadline" :estimated-minutes="estimatedMinutes" :language="preferredLang" />

      <hr>

      <TermsOfService :is-agree-to-privacy-policy.sync="referee.isAgreeToPrivacyPolicy" :language="preferredLang" />

      <div class="mt-1 centerize">
        <el-button type="primary" :disabled="!referee.isAgreeToPrivacyPolicy" @click="gotoNext">{{ commonI18n.t('message.next') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import TermsOfService from '@/components/TermsOfService'
import Deadline from '@/components/Deadline'
import { refereePageMixin } from './mixin/refereePageMixin'

export default {
  name: 'Instruction',
  components: { TermsOfService, Deadline },
  mixins: [refereePageMixin],
  async created() {
    await this.setup().finally(this.toggleLoading)
    // プライバシーポリシーに同意しているなら次のページ(認証画面)へ移動
    if (this.referee.isAgreeToPrivacyPolicy) this.gotoNext()
  },
  methods: {
    gotoNext() {
      this.toggleLoading()
      const refereeId = this.$route.query.token
      this._refereeApi.updateAll([{ id: refereeId, isAgreeToPrivacyPolicy: true }])
        .then(() => {
          this.$router.push({ name: 'refereeAuthentication', query: this.$route.query })
        })
        .finally(this.toggleLoading)
    }
  }
}
</script>

<style lang="sass" scoped>
.text-bold
  font-weight: bold
.mt-1
  margin-top: 1rem
.centerize
  text-align: center
  justify-content: center
.pull-right
  margin-left: auto
.d-flex
  display: flex
  align-items: center
.description
  padding-left: 1rem
time
  color: #1a86f5
  font-size: 1.2em
  font-weight: bold
.step-text
  color: #303133
hr
  margin-bottom: 2rem
</style>
