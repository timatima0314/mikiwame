<template>
  <div v-loading="loading" class="container">
    <p v-html="commonI18n.t('message.boldHonorific', { name: talent.name })" />
    <p>{{ talentI18n.t('message.thankYouForYourApplication', { companyName: company.name }) }}</p>

    <el-card class="mt-1">
      <h2 v-if="$mq==='pc'">{{ commonI18n.t('message.aboutReferenceCheck') }}</h2>
      <h3 v-if="$mq==='sp'">{{ commonI18n.t('message.aboutReferenceCheck') }}</h3>
      <div class="description">
        <p>{{ commonI18n.t('message.aboutReferenceCheckText1') }}</p>
        <p>{{ commonI18n.t('message.aboutReferenceCheckText2') }}</p>
      </div>

      <hr>

      <h2 v-if="$mq==='pc'">{{ commonI18n.t('message.usageFlow') }}</h2>
      <h3 v-if="$mq==='sp'">{{ commonI18n.t('message.usageFlow') }}</h3>
      <el-steps direction="vertical" :active="3">
        <el-step :title="talentI18n.t('message.pleaseInformYourReferences')">
          <p slot="description" class="step-text" v-html="talentI18n.t('message.pleaseInformYourReferencesText', { minutes: estimatedMinutes })" />
        </el-step>
        <el-step :title="talentI18n.t('message.thenRegisterYourReferences')">
          <p slot="description" class="step-text" v-html="talentI18n.t('message.thenRegisterYourReferencesText')" />
        </el-step>
        <el-step :title="talentI18n.t('message.pleaseIssueAndRequest')">
          <p slot="description" class="step-text">{{ talentI18n.t('message.pleaseIssueAndRequestText') }}</p>
        </el-step>
      </el-steps>

      <Deadline :date="talent.deadline" :estimated-minutes="estimatedMinutes" :language="talent.language" />

      <hr>

      <TermsOfService :is-agree-to-privacy-policy.sync="talent.isAgreeToPrivacyPolicy" :language="talent.language" />

      <div class="mt-1 centerize">
        <el-button type="primary" :disabled="!talent.isAgreeToPrivacyPolicy" @click="updateTalentStatus">{{ commonI18n.t('message.next') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// import firebase from 'firebase/app'
import { TalentApi } from '@/utils/api/talent_api'
import { statusProperty } from '@/constants/status'
import TermsOfService from '@/components/TermsOfService'
import Deadline from '@/components/Deadline'
import { getI18n } from '@/constants/i18n'

export default {
  name: 'Instruction',
  components: { TermsOfService, Deadline },
  data: () => ({
    loading: false,
    company: { name: '' },
    talent: {
      name: '',
      deadline: undefined,
      isAgreeToPrivacyPolicy: false,
      language: 'jp'
    },
    estimatedMinutes: 0
  }),
  computed: {
    talentI18n() {
      const i18n = getI18n('talent')
      i18n.locale = this.talent.language
      return i18n
    },
    notifyI18n() {
      const i18n = getI18n('notify')
      i18n.locale = this.talent.language
      return i18n
    },
    commonI18n() {
      const i18n = getI18n('common')
      i18n.locale = this.talent.language
      return i18n
    }
  },
  async created() {
    try {
      this.toggleLoading()
      const { company: companyId, token: talentId } = this.$route.query
      if (companyId === undefined || talentId === undefined) this.$router.push('/404')
      // await firebase.auth().signInAnonymously()

      const { companyName, talentData, estimatedMinutes } = await new TalentApi({ companyId, talentId }).get()
      this.company.name = companyName
      if (talentData.isAgreeToPrivacyPolicy) this.gotoNext()

      this.talent = {
        name: talentData.name,
        deadline: talentData.deadline,
        isAgreeToPrivacyPolicy: Boolean(talentData.isAgreeToPrivacyPolicy),
        language: talentData.language
      }
      this.estimatedMinutes = estimatedMinutes
    } catch (err) {
      this.$rollbar.error(err)
    } finally {
      this.toggleLoading()
    }
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading
    },
    // 利用規約に同意し次へを押したときのみ実行
    updateTalentStatus() {
      this.toggleLoading()
      const { company: companyId, token: talentId } = this.$route.query
      new TalentApi({ companyId, talentId }).update({ isAgreeToPrivacyPolicy: true, status: statusProperty.agreeToPrivacyPolicy.key })
        .then(() => { this.gotoNext() })
        .catch(() => {
          this.$notify({
            type: 'error',
            title: 'Error',
            message: this.notifyI18n.t('errorPleaseAgain')
          })
        })
        .finally(this.toggleLoading)
    },
    gotoNext() {
      this.toggleLoading()
      this.$router.push({ path: '/talent', query: this.$route.query })
      this.toggleLoading()
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  width: 80%
  margin: 2rem auto
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
.scrollable-container
  height: 23rem
  font-size: .7rem
  margin-bottom: 2rem
  padding: 2rem
  border: .1rem solid #dadada
  background-color: #f6f7fa
  line-height: 2.3rem
  overflow-y: auto
time
  color: #1a86f5
  font-size: 1.2em
  font-weight: bold
.step-text
  color: #303133
hr
  margin-bottom: 2rem
</style>
