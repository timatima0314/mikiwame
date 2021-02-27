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
        <div v-html="remidI18n.t('message.unSubscribeText', { name: talentName })" />
      </section>
    </template>
  </el-card>
</template>

<script>
import { RefereeApi } from '@/utils/api/referee_api'
import { getI18n } from '@/constants/i18n'

export default {
  data: () => ({
    loading: true,
    hasError: false,
    talentName: '',
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
    const { company: companyId, talent: talentId, token: refereeId } = this.$route.query
    if (companyId == null || talentId == null || refereeId == null) return this.$router.push('/404')

    const refereeApi = RefereeApi({ companyId, talentId, refereeId })
    try {
      const { talentName, refereeData } = await refereeApi.get()
      this.language = refereeData.language
      this.talentName = talentName
      await refereeApi.update({ isUnsubscribeRemind: true })
    } catch (err) {
      this.$rollbar.error(err)
      this.hasError = true
    } finally {
      this.loading = false
    }
  }
}
</script>
