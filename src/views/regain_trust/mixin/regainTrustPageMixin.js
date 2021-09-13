import { TalentApi } from '@/utils/api/talent_api'
import * as Sentry from '@sentry/vue'

export const regainTrustPageMixin = {
  data: () => ({
    loading: false,
    company: { name: '' },
    referees: '',
    talent: {
      excuseCompletedAt: null,
      excuseDeadline: null,
      excusesToRegainTrust: {
        fromReferees: [{
          text: '',
          answers: [{
            text: '',
            excuse: ''
          }]
        }],
        fromCompany: {
          text: '',
          excuse: ''
        }
      }
    },
    rules: {
      excuse: [{ required: true, message: '回答を入力してください', trigger: 'blur' }]
    },
    preferredLang: 'jp'
  }),
  methods: {
    toggleLoading() {
      this.loading = !this.loading
    },
    pushWithInheritingQuery(name) {
      this.$router.push({ name, query: this.$route.query })
    },
    async setup() {
      this.toggleLoading()

      const goto404 = () => this.$router.push('/404')
      const { company: companyId, token: talentId } = this.$route.query
      if (companyId === undefined || talentId === undefined) goto404()

      const { companyName, talentData, refereesData } = await TalentApi({ companyId, talentId }).get().catch(goto404)
      this.company.name = companyName
      this.talent = talentData
      this.referees = refereesData

      this.toggleLoading()
    },
    async saveExcuses() {
      const { company: companyId, token: talentId } = this.$route.query
      const talentApi = TalentApi({ companyId, talentId })
      return talentApi.update({
        excusesToRegainTrust: this.talent.excusesToRegainTrust
      })
    },
    async confirmExcuses() {
      const { company: companyId, token: talentId } = this.$route.query
      const talentApi = TalentApi({ companyId, talentId })
      return talentApi.update({
        excuseCompletedAt: new Date()
      })
    },
    notifySuccess() {
      this.$notify({
        title: 'Success',
        message: '回答の送信に成功しました。',
        type: 'success'
      })
    },
    notifyError(err = null) {
      if (err) Sentry.captureException(new Error(err))
      this.$notify({
        title: 'Error',
        message: '回答の送信に失敗しました。通信環境を確認したうえで再度お試しください。',
        type: 'error'
      })
    }
  }
}
