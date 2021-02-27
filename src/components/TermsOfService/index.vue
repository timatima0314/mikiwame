<template>
  <div>
    <h2 v-if="$mq==='pc'">{{ commonI18n.t('message.useOfServices') }}</h2>
    <h3 v-if="$mq==='sp'">{{ commonI18n.t('message.useOfServices') }}</h3>
    <div class="scrollable-container">
      <div v-html="termsOfServiceI18n.t('message.text')" />
      <p style="text-align: right; margin-right: 3rem">{{ termsOfServiceI18n.t('message.end') }}</p>
      <p v-html="termsOfServiceI18n.t('message.enactment')" />
    </div>
    <div class="d-flex centerize">
      <el-checkbox :value="isAgreeToPrivacyPolicy" @change="onChangeAgree">{{ commonI18n.t('message.agreeToHandlingOfPersonalInformation') }}</el-checkbox>
    </div>
  </div>
</template>

<script>
/**
 * @use <PrivacyPolicy :is-agree-to-privacy-policy.sync="isAgreeToPrivacyPolicy" />
 */

import { getI18n } from '@/constants/i18n'

export default {
  name: 'PrivacyPolicy',
  props: {
    isAgreeToPrivacyPolicy: { type: Boolean, required: true },
    language: { type: String, default: 'jp' }
  },
  computed: {
    commonI18n() {
      const i18n = getI18n('common')
      i18n.locale = this.language
      return i18n
    },
    termsOfServiceI18n() {
      const i18n = getI18n('termsOfService')
      i18n.locale = this.language
      return i18n
    }
  },
  methods: {
    onChangeAgree() {
      this.$emit('update:isAgreeToPrivacyPolicy', !this.isAgreeToPrivacyPolicy)
    }
  }
}
</script>

<style lang="sass" scoped>
.d-flex
  display: flex
  align-items: center
.centerize
  justify-content: center
</style>
