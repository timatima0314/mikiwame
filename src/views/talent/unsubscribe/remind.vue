<template>
  <el-card v-if="!loading" class="container">
    <template v-if="hasError">
      <h1 slot="header">{{ remindI18n.t('message.error') }}</h1>
      <section>
        <p>{{ remindI18n.t('message.errorText') }}</p>
      </section>
    </template>
    <template v-else>
      <h1 slot="header">{{ remindI18n.t('message.unSubscribe') }}</h1>
      <section>
        <p>{{ remindI18n.t('message.thanks') }}</p>
        <div v-html="remidI18n.t('message.unSubscribeText', { name: companyName })" />
      </section>
    </template>
  </el-card>
</template>

<script>
import { TalentApi } from '@/utils/api/talent_api'
import { getI18n } from '@/constants/i18n'
import * as Sentry from '@sentry/vue'

export default {
  data: () => ({
    loading: true,
    hasError: false,
    companyName: '',
    language: 'jp'
  }),
  computed: {
    remindI18n() {
      const i18n = getI18n('remind')
      i18n.locale = this.language
      return i18n
    }
  },
  async created() {
    const { company: companyId, token: talentId } = this.$route.query
    if (companyId == null || talentId == null) return this.$router.push('/404')

    const talentApi = TalentApi({ companyId, talentId })
    try {
      const { companyName, talentData } = await talentApi.get()
      this.language = talentData.language
      this.companyName = companyName
      await talentApi.update({ isUnsubscribeRemind: true })
    } catch (err) {
      Sentry.captureException(new Error(err))
      this.hasError = true
    } finally {
      this.loading = false
    }
  }
}
</script>
