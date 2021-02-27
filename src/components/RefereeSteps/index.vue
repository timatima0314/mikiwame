<template>
  <div class="wrapper">
    <el-steps :active="stepNumber" align-center finish-status="success">
      <el-step :title="$mq === 'pc' ? refereeI18n.t('message.personalInformationHandlingConsent') : refereeI18n.t('message.spPersonalInformationHandlingConsent')" />
      <el-step :title="$mq === 'pc' ? refereeI18n.t('message.phoneNumberVerification') : refereeI18n.t('message.spPhoneNumberVerification')" />
      <el-step :title="refereeI18n.t('message.questionnaire')" />
      <el-step v-if="isBusinessCardRequired" :title="refereeI18n.t('message.identification')" />
      <el-step :title="$mq === 'pc' ? refereeI18n.t('message.referenceCheckCompleted') : refereeI18n.t('message.spReferenceCheckCompleted')" />
    </el-steps>
  </div>
</template>

<script>

const STEPS = {
  refereeInstruction: 0,
  refereeAuthentication: 1,
  answerDescriptions: 2,
  answerSelections: 2,
  refereeIdentification: 3,
  // すべてのステップにチェックをいれて、リファレンスチェックが完了したことを伝えるため通常よりも1大きい値を返す
  refereeComplete: 5
}

import { getI18n } from '@/constants/i18n'

export default {
  name: 'RefereeSteps',
  props: {
    isBusinessCardRequired: { type: Boolean, default: true },
    language: { type: String, default: 'jp' },
    isCompleted: { type: Boolean, default: false }
  },
  computed: {
    stepNumber() {
      // 回答完了済みならstepsも完了とする
      if (this.isCompleted) return STEPS['refereeComplete']
      return STEPS[this.$route.name]
    },
    refereeI18n() {
      const i18n = getI18n('referee')
      i18n.locale = this.language
      return i18n
    }
  }
}
</script>

<style lang="sass" scoped>
.wrapper
  margin-bottom: 1rem
</style>
