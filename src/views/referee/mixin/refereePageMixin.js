import { RefereeApi } from '@/utils/api/referee_api'
import { selectionPatterns, radioSelectionText, radioSelectionScore } from '@/constants/questions'
import { getI18n } from '@/constants/i18n'
import dayjs from 'dayjs'
import * as Sentry from '@sentry/vue'

export const refereePageMixin = {
  data: () => ({
    selectionPatterns,
    radioSelectionText,
    radioSelectionScore,
    _refereeApi: {},
    loading: true,
    talent: { name: '', phoneNumber: '' },
    referee: { name: '', isAgreeToPrivacyPolicy: false },
    refereesPhoneNumber: {},
    deadline: new Date(),
    answer: {
      descriptions: {},
      selections: {}
    },
    questions: {
      jp: {
        descriptions: [],
        selections: []
      },
      en: {
        descriptions: [],
        selections: []
      },
      cn: {
        descriptions: [],
        selections: []
      }
    },
    ruleMessage: {
      descriptionAnswer: ''
    },
    estimatedMinutes: 25, // 推定回答時間(分)
    preferredLang: ''
  }),
  computed: {
    /**
     * 質問の言語
     * 推薦者の言語に日本語が選択されていたとしても、英語の質問が用意されていない場合は日本語を用いる
     * @returns {'jp'|'en'|'cn'}
     */
    handingLang() {
      if (this.preferredLang === 'jp') return 'jp'
      else {
        if (this.questions[this.preferredLang]?.descriptions.length) {
          // その言語で質問が用意されている場合
          return this.preferredLang
        } else {
          // その言語での質問が用意されていない場合
          return 'jp'
        }
      }
    },
    descriptionQuestions() {
      return this.questions[this.handingLang].descriptions
    },
    selectionQuestions() {
      return this.questions[this.handingLang].selections
    },
    descriptionsLength() {
      return this.descriptionQuestions.length
    },
    selectionsLength() {
      return this.selectionQuestions.length
    },
    isAfterDeadline() {
      return dayjs().isAfter(dayjs(this.deadline), 'day')
    },
    refereeI18n() {
      const i18n = getI18n('referee')
      i18n.locale = this.preferredLang
      return i18n
    },
    notifyI18n() {
      const i18n = getI18n('notify')
      i18n.locale = this.preferredLang
      return i18n
    },
    commonI18n() {
      const i18n = getI18n('common')
      i18n.locale = this.preferredLang
      return i18n
    },
    rules() {
      return {
        descriptionAnswer: [{ required: true, message: this.refereeI18n.tc('message.pleaseFillOut'), trigger: 'blur' }],
        selectionAnswer: [{ required: true, message: this.refereeI18n.tc('message.pleaseSelect'), trigger: 'change' }]
      }
    }
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading
    },
    pushWithInheritingQuery(name) {
      this.$router.push({ name, query: this.$route.query })
    },
    async setup() {
      const { company: companyId, talent: talentId, token: refereeId } = this.$route.query
      const goto404 = () => this.$router.push('/404')
      if ([companyId, talentId, refereeId].some(leftSide => leftSide === undefined)) goto404()

      this._refereeApi = RefereeApi({ companyId, talentId, refereeId })
      const { talentName, talentPhoneNumber, refereesPhoneNumber, deadline, questions, estimatedMinutes, refereeData, isBusinessCardRequired } = await this._refereeApi.get().catch(goto404)
      this.refereesPhoneNumber = refereesPhoneNumber
      this.talent.name = talentName
      this.talent.phoneNumber = talentPhoneNumber
      this.deadline = deadline
      this.estimatedMinutes = estimatedMinutes
      this.isBusinessCardRequired = isBusinessCardRequired
      this.referee = { ...refereeData, isAgreeToPrivacyPolicy: Boolean(refereeData.isAgreeToPrivacyPolicy) }
      if (questions) this.questions = { ...questions }
      if (refereeData.answer) this.answer = { ...refereeData.answer }

      this.preferredLang = refereeData.language
    },
    saveAnswer() {
      const refereeId = this.$route.query.token
      return this._refereeApi.updateAll([{ id: refereeId, answer: this.answer }])
    },
    notifySuccess() {
      this.$notify({
        title: 'Success',
        message: this.notifyI18n.tc('message.AnswerSentSuccessfully'),
        type: 'success'
      })
    },
    notifyError(err = null) {
      if (err) Sentry.captureException(new Error(err))
      this.$notify({
        title: 'Error',
        message: this.notifyI18n.tc('message.answerSentFailed'),
        type: 'error'
      })
    },
    goCompletePage() {
      this.toggleLoading()
      this.$confirm(this.refereeI18n.t('message.onceYouHaveCompleted'), this.refereeI18n.t('message.doYouCompleted'))
        .then(() => {
          this.pushWithInheritingQuery('refereeComplete')
        })
        .catch(() => { })
    }
  }
}
