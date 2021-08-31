<template>
  <el-card v-loading="loading" class="container">
    <p v-html="commonI18n.t('message.boldHonorific', { name: talent.name })" />
    <p>{{ talentI18n.t('message.thankYouForYourApplication', { companyName: company.name }) }}</p>
    <p>{{ talentI18n.t('message.pleaseRegisterYourReferences') }}</p>

    <el-card>
      <div slot="header" class="text-bold d-flex">
        <span>{{ talentI18n.t('message.pleaseRegisterFollowingNominees') }}</span>
      </div>
      <div v-for="(refereeBreakdown, i) in talent.refereeBreakdown" :key="i">
        {{ commonI18n.t('message.relationships') }} :
        <span v-if="refereeBreakdown.relationship==='other'">{{ refereeBreakdown.otherRelationship }}</span>
        <span v-else-if="refereeBreakdown.relationship">{{ options.relationshipOptions.find((v) => (v.value === refereeBreakdown.relationship)).label }}</span>
        <span v-else>{{ commonI18n.t('message.noSpecification') }}</span><br>
        {{ commonI18n.t('message.timeWorkingTogether') }} :
        <span v-if="refereeBreakdown.timeWorkingTogether==='other'">{{ refereeBreakdown.otherTimeWorkingTogether }}</span>
        <span v-else-if="refereeBreakdown.timeWorkingTogether">{{ options.timeWorkingOptions.find((v) => (v.value===refereeBreakdown.timeWorkingTogether)).label }}</span>
        <span v-else>{{ commonI18n.t('message.noSpecification') }}</span>
        <p>{{ commonI18n.t('message.numberOfPeople', { number: refereeBreakdown.numberOfPeople }) }}</p>
        <hr>
      </div>

      <p>{{ commonI18n.t('message.total', { number: sumOfReferees }) }}</p>
    </el-card>

    <el-card v-for="(referee, i) in undeletedReferees" :key="i" class="mt-1">
      <div slot="header" class="text-bold d-flex">
        <span>{{ commonI18n.t('message.referee') }}{{ i + 1 }}</span>
        <el-button v-if="undeletedReferees.length >= 2" type="danger" icon="el-icon-delete" size="small" class="pull-right" @click="referee._meta.willDelete = true" />
      </div>
      <el-form ref="forms" :model="referee" :rules="rules" :label-position="$mq === 'pc' ? 'right' : 'top'" :label-width="$mq === 'pc' ? '11rem' : '20rem'">
        <el-form-item :label="commonI18n.t('message.name')" prop="name">
          <el-input v-model="referee.name" :placeholder="talentI18n.t('message.placeholderName')" />
        </el-form-item>
        <el-form-item :label="commonI18n.t('message.belongs')" prop="belongs">
          <el-input v-model="referee.belongs" :placeholder="talentI18n.t('message.placeholderBelongs')" />
        </el-form-item>
        <el-form-item :label="commonI18n.t('message.emailAddress')" prop="email">
          <el-input v-model="referee.email" placeholder="info@mikiwame-p.jp" />
        </el-form-item>
        <el-form-item :label="commonI18n.t('message.relationshipWithReferences')" prop="relationship">
          <el-select v-model="referee.relationship" :disabled="referee.isRelationshipSelectedByCompany" :placeholder="talentI18n.t('message.placeholderSelect')">
            <el-option
              v-for="item in options.relationshipOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-if="referee.relationship==='other'"
            v-model="referee.otherRelationship"
            :placeholder="talentI18n.t('message.placeholderRelationship')"
            :readonly="referee.isRelationshipSelectedByCompany"
          />
        </el-form-item>
        <el-form-item :label="commonI18n.t('message.timeWorkingTogether')" prop="timeWorkingTogether">
          <el-select v-model="referee.timeWorkingTogether" :disabled="referee.isTimeWorkingTogetherSelectedByCompany" :placeholder="talentI18n.t('message.placeholderSelect')">
            <el-option
              v-for="item in options.timeWorkingOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-if="referee.timeWorkingTogether==='other'"
            v-model="referee.otherTimeWorkingTogether"
            :placeholder="talentI18n.t('message.placeholderOtherTimeWorkingTogether')"
            :readonly="referee.isTimeWorkingTogetherSelectedByCompany"
          />
        </el-form-item>
        <el-form-item :label="commonI18n.t('message.timeToBeginWorkingTogether')" prop="timeToBeginWorkingTogether">
          <el-date-picker v-model="referee.timeToBeginWorkingTogether" type="month" placeholder="2000-1" /> 〜
          <el-form label-position="top">
            <el-form-item :label="talentI18n.t('message.stillWorkingTogegher')">
              <el-radio-group v-model="workingTogether">
                <el-radio label="1">{{ commonI18n.tc('message.yes') }}</el-radio>
                <el-radio label="0">{{ commonI18n.tc('message.no') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div v-if="workingTogether==='0'">〜 <el-date-picker v-model="referee.timeToEndWorkingTogether" type="month" placeholder="2010-1" /></div>
        </el-form-item>
        <el-form-item :label="commonI18n.t('message.jobCategory')" prop="jobCategory">
          <el-cascader v-model="referee.jobCategory" :options="options.jobCategoryOptions" :placeholder="talentI18n.t('message.placeholderSelect')" />
        </el-form-item>
        <el-form-item :label="commonI18n.t('message.companyTogether')" prop="company">
          <el-input v-model="referee.company" :placeholder="talentI18n.t('message.placeholderCompany')" />
        </el-form-item>

        <el-form-item :label="commonI18n.t('message.refereeLanguage')" prop="language" style="text-align: left">
          <el-radio-group v-model="referee.language" placeholder="language">
            <el-radio
              v-for="(option, j) in options.questionsLang"
              :key="j"
              :label="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
    </el-card>
    <el-button icon="el-icon-plus" class="mt-1" @click="addReferee">{{ talentI18n.t('message.addReferee') }}</el-button>
    <div class="mt-1 centerize">
      <el-button type="info" icon="el-icon-check" @click="saveReferees">{{ talentI18n.t('message.saveReferee') }}</el-button>
      <el-button type="primary" icon="el-icon-copy-document" @click="saveAndGoNext">{{ talentI18n.t('message.goURLPublishing') }}</el-button>
    </div>
  </el-card>
</template>

<script>
/**
 * /talent?company=<company_id>&token=<token>
 */
// import firebase from 'firebase/app'
import omit from 'lodash/omit'
import sumBy from 'lodash/sumBy'
// import { functions } from '@/plugins/firebase' // 2020/12 メール送信機能のコメントアウトに伴うコメント化
import { TalentApi } from '@/utils/api/talent_api'
import { RefereeApi } from '@/utils/api/referee_api'
import { getRelationshipOptionsByLang, getTimeWorkingOptionsByLang, getJobCategoryOptionsByLang, getQuestionsLangByLang } from '@/constants/options'
import { statusProperty } from '@/constants/status'
import { freeEmailProviderDomains } from '@/constants/free_email_provider_domains'
import { getI18n } from '@/constants/i18n'

const defaultBreakdown = () => ({
  relationship: '',
  isRelationshipSelectedByCompany: false,
  otherRelationship: '', // relationshipがotherの場合のみ
  timeWorkingTogether: '',
  isTimeWorkingTogetherSelectedByCompany: false,
  otherTimeWorkingTogether: '' // timeWorkingTogetherがotherの時にのみ有効
})

const getEmptyReferee = (breakdown = defaultBreakdown()) => ({
  ...breakdown,
  id: null,
  indexNumber: null, // 推薦者登録画面での推薦者の並び順を保つため
  name: '',
  belongs: '',
  email: '',
  timeToBeginWorkingTogether: '',
  timeToEndWorkingTogether: '',
  jobCategory: '',
  company: '',
  language: 'jp',
  sendAt: '',
  _meta: { willDelete: false }
})

export default {
  name: 'TalentIndex',
  data() {
    return {
      loading: false,
      company: { name: '', isFreemailAllowed: false },
      talent: {
        name: '',
        email: '',
        refereeBreakdown: [],
        documentRef: null,
        language: 'jp'
      },
      referees: [],
      beforeRefereeEmails: [],
      workingTogether: '1'
    }
  },
  computed: {
    existsRerefee() {
      return this.referees.length >= 1
    },
    undeletedReferees() {
      return this.referees.filter(({ _meta }) => !_meta.willDelete)
    },
    updatedReferees() {
      return this.undeletedReferees.filter(referee => referee.id !== null)
    },
    addedReferees() {
      return this.undeletedReferees.filter(referee => referee.id === null)
    },
    shouldDeleteReferees() {
      return this.referees.filter(referee => referee._meta.willDelete && referee.id !== null)
    },
    sumOfReferees() {
      return sumBy(this.talent.refereeBreakdown, 'numberOfPeople')
    },
    unsentReferees() {
      return this.undeletedReferees.filter(referee => !referee.sendAt)
    },
    options() {
      return {
        questionsLang: getQuestionsLangByLang(this.talent.language),
        relationshipOptions: getRelationshipOptionsByLang(this.talent.language),
        timeWorkingOptions: getTimeWorkingOptionsByLang(this.talent.language),
        jobCategoryOptions: getJobCategoryOptionsByLang(this.talent.language)
      }
    },
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
    },
    rules() {
      // email用の検証
      // validatorを指定すると、それ以外の条件は追加できない（？）ので一関数にまとめる
      // 赤いコメ印をつけるためにrulesにはrequire: tureとありますが，機能はしていません
      const validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.talentI18n.t('message.validEmailRequire')))
        } else if (!value.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
          callback(new Error(this.talentI18n.t('message.validEmailFormat')))
        } else {
          const [, inputedDomain] = value.split('@')
          if (!this.company.isFreemailAllowed && freeEmailProviderDomains.includes(inputedDomain)) {
            callback(new Error(this.talentI18n.t('message.validEmailFree')))
          }
        }
        callback()
      }

      return {
        name: [{ required: true, message: this.talentI18n.t('message.validName'), trigger: 'blur' }],
        belongs: [{ required: true, message: this.talentI18n.t('message.validBelongs'), trigger: 'blur' }],
        email: [
          { validator: validateEmail, trigger: 'blur' },
          { required: true, trigger: 'blur' }
        ],
        relationship: [{ required: true, message: this.talentI18n.t('message.validRelationship'), trigger: 'blur' }],
        timeWorkingTogether: [{ required: true, message: this.talentI18n.t('message.validTimeWorkingTogether'), trigger: 'blur' }],
        timeToBeginWorkingTogether: [{ required: true, message: this.talentI18n.t('message.validTimeToBeginWorkingTogether'), trigger: 'blur' }],
        jobCategory: [{ required: true, message: this.talentI18n.t('message.validJobCategory'), trigger: 'blur' }],
        company: [{ required: true, message: this.talentI18n.t('message.validCompany'), trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchReferees()
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading
    },
    async fetchReferees() {
      this.toggleLoading()
      const goto404 = () => this.$router.push('/404')
      const { company: companyId, token: talentId } = this.$route.query
      if (companyId === undefined || talentId === undefined) goto404()
      // await firebase.auth().signInAnonymously()

      // 一旦、talentsコレクションのidをtokenとして用いる
      const { companyName, talentData, refereesData, isFreemailAllowed } = await TalentApi({ companyId, talentId }).get().catch(goto404)
      this.company.name = companyName
      this.company.isFreemailAllowed = isFreemailAllowed
      if (!talentData.isAgreeToPrivacyPolicy) {
        this.$router.push({ path: '/talent/instruction', query: this.$route.query })
      }
      this.talent = talentData

      this.referees = refereesData.map(referee => ({ ...referee, _meta: { willDelete: false }}))
      // indexNumberで昇順ソート
      this.referees.sort((a, b) => {
        return (a.indexNumber - b.indexNumber)
      })
      this.beforeRefereeEmails = refereesData.map(referee => ({ id: referee.id, email: referee.email }))

      if (this.referees.length === 0) this.setDefaultReferees() // 推薦者の保存を一度も行っていない場合
      this.toggleLoading()
    },
    notifySuccess(message) {
      this.$notify({
        title: 'Success',
        message: this.notifyI18n.t('message.somthingSuccess', { message: message }),
        type: 'success'
      })
    },
    omitMetaFromReferee(referee) {
      return omit(referee, '_meta')
    },
    // 読み込んだ推薦者内訳を追加
    setDefaultReferees() {
      this.referees.push(...this.talent.refereeBreakdown.map(breakdown =>
        Array.from({ length: breakdown.numberOfPeople }).map(() =>
          getEmptyReferee({
            ...defaultBreakdown(),
            relationship: breakdown.relationship,
            isRelationshipSelectedByCompany: breakdown.isRelationshipSelectedByCompany,
            otherRelationship: breakdown.otherRelationship || '',
            timeWorkingTogether: breakdown.timeWorkingTogether,
            isTimeWorkingTogetherSelectedByCompany: breakdown.isTimeWorkingTogetherSelectedByCompany,
            otherTimeWorkingTogether: breakdown.otherTimeWorkingTogether || ''
          })
        )
      ).flat())
    },
    addReferee() {
      this.referees.push(getEmptyReferee())
    },
    // 推薦者の保存のみを行う
    async saveReferees() {
      this.toggleLoading()
      const { company: companyId, token: talentId } = this.$route.query
      const refereeApi = RefereeApi({ companyId, talentId })

      this.undeletedReferees.map(referee => {
        referee.indexNumber = this.undeletedReferees.indexOf(referee)
      })
      const requests = []
      if (this.addedReferees.length) {
        requests.push(
          refereeApi.add(
            this.addedReferees.map(referee => ({
              ...this.omitMetaFromReferee(referee), createdAt: new Date()
            }))
          )
        )
      }
      if (this.updatedReferees.length) {
        requests.push(
          refereeApi.updateAll(this.updatedReferees.map(referee => {
            if (referee.email !== this.beforeRefereeEmails.find(beforeReferee => { return (referee.id === beforeReferee.id) }).email) referee.sendAt = null
            return this.omitMetaFromReferee(referee)
          }))
        )
      }
      if (this.shouldDeleteReferees.length) {
        requests.push(
          refereeApi.delete(this.shouldDeleteReferees.map(referee => referee.id))
        )
      }
      const results = await Promise.all(requests)
        .catch(err => {
          this.$rollbar.error(err)
          this.$notify({
            title: 'Error',
            message: this.notifyI18n.t('message.errorSaving'),
            type: 'error'
          })
        })
      if (results === undefined) return this.toggleLoading()

      // 推薦者が追加された場合、
      // リファレンスチェックの完了フラグをオフにする
      // TODO: #37 ステータスの完了の定義に変更の必要がある
      if (this.addedReferees.length) {
        const talentApi = TalentApi({ companyId, talentId })
        await talentApi.update({ completedAt: null, status: statusProperty.refereesRegistered.key }).catch(() => {})
      }

      this.toggleLoading()
      await this.fetchReferees()
      this.notifySuccess(this.talentI18n.t('message.successMessageSaveReferee'))
    },
    async saveAndGoNext() {
      const valid = await this.validateReferees()
      if (!valid) return
      await this.saveReferees()
      this.goNext()
    },
    // 2020/12 メール送信機能を無くし、URL発行機能へ変更した為コメントアウト

    // 「推薦者へメールを送信」が押されると呼び出される
    /*
    async saveAndSendReferees() {
      const valid = await this.validateReferees()
      if (!valid) return

      await this.saveReferees()

      this.toggleLoading()
      try {
        await this.confirmSendingMail()
      } catch {
        return this.toggleLoading()
      }

      try {
        await this.sendEmailToReferees({
          targetReferees: this.unsentReferees,
          withConfirm: false,
          withLoading: true
        })
      } finally {
        this.toggleLoading()
      }
    },
    */
    // 2020/12 メール送信機能を無くし、URL発行機能へ変更した為コメントアウト
    /**
     * メールを送信するか確認する
     * @throws {Error} 送信しない場合
     */
    /*
    confirmSendingMail() {
      const h = this.$createElement
      return new Promise((resolve, reject) => {
        this.$msgbox({
          title: this.talentI18n.t('message.confirmSendingMailModalTitle'),
          message: h('div', null, [
            h('p', null, this.talentI18n.t('message.confirmSendingMailModalText')),
            this.unsentReferees.map(referee =>
              h('p', null, this.commonI18n.t('message.honorific', { name: referee.name }))
            )
          ]),
          confirmButtonText: this.talentI18n.t('message.confirmSendingMailModalYes'),
          showCancelButton: true,
          cancelButtonText: this.talentI18n.t('message.confirmSendingMailModalNo'),
          showClose: false, // 閉じられるとメールの送信ができたかがわかりずらいので、バツボタンを消す
          beforeClose: (action, _, done) => {
            done()
            if (action === 'confirm') resolve() // 「送信する」が押された場合
            else reject() // 「送信せず、推薦者情報を修正する」が押された場合
          },
          center: this.$mq === 'sp',
          customClass: this.$mq === 'sp' ? 'talent-sp-dialog' : ''
        })
      })
    },
    */
    /**
     * @param {object} arg
     * @param {string[]|null} arg.targetReferees メールを送信したい推薦者。nullの場合は全送信
     * @param {boolean} arg.withConfirm // 送信前に確認を行うか
     * @param {boolean} arg.withLoading // ローディングを行うか
     */
    // 2020/12 メール送信機能を無くし、URL発行機能へ変更した為コメントアウト
    /*
    async sendEmailToReferees({ targetReferees = null, withConfirm = true, withLoading = true }) {
      // 「推薦者全員に依頼メールを送信」から呼び出された場合
      if (withConfirm) {
        const valid = await this.validateReferees()
        if (!valid) return

        await this.saveReferees()

        const confirm = await this.$confirm(this.talentI18n.t('message.confirmSendingAllMailText'), {
          center: this.$mq === 'sp',
          customClass: this.$mq === 'sp' ? 'talent-sp-dialog' : ''
        }).catch(() => {})
        if (confirm === undefined) return
      }

      if (targetReferees === null) {
        // 保存済みのすべての推薦者を対象にする
        targetReferees = this.undeletedReferees
      }

      if (withLoading) this.toggleLoading()

      const { company: companyId, token: talentId } = this.$route.query

      // https://github.com/team-5g/mikiwame/issues/276
      // sendgrid の送信完了を待つと、3秒以上ローディングで待たされてしまう。そのため、完了を待たずに成功通知を出してしまう。
      Promise.all(targetReferees.map(referee =>
        functions.httpsCallable('sendMailToRefereeByIds')({
          companyId: companyId,
          talentId: talentId,
          refereeId: referee.id
        })
      ))

      this.notifySuccess(this.talentI18n.t('message.successMessageSendMail'))

      RefereeApi({ companyId, talentId }).updateAll(targetReferees.map(referee => ({
        ...this.omitMetaFromReferee(referee), sendAt: new Date()
      })))

      TalentApi({ companyId, talentId }).update({ isMailToRefereesSent: true })
      this.talent.isMailToRefereesSent = true

      if (withLoading) this.toggleLoading()
      this.goNext()
    },
    */
    async deleteReferee(index) {
      const confirm = await this.$confirm(this.talentI18n.t('message.commitDeleteReferee', { number: (index + 1) })).catch(() => {})
      if (confirm === undefined) return
      this.referees._meta.willDelete = true
    },
    // 推薦者の人数と内容を検証
    async validateReferees() {
      try {
        await Promise.all(this.$refs.forms.map(form => form.validate()))
      } catch {
        this.$notify({ type: 'error', title: 'Error', message: this.notifyI18n.t('message.inputIsIncomplete') })
        return false
      }

      if (this.undeletedReferees.length < this.sumOfReferees) {
        this.$notify({ title: 'Warning', message: this.talentI18n.t('message.warningInsufficientReferee'), type: 'warning' })
        return false
      }

      return true
    },
    goNext() {
      const { company: companyId, token: talentId } = this.$route.query
      this.$router.push({
        name: 'talentComplete',
        query: this.$route.query,
        params: {
          language: this.talent.language,
          talentName: this.talent.name,
          companyId: companyId,
          talentId: talentId,
          undeletedReferees: this.undeletedReferees
        }
      })
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
.pull-right
  margin-left: auto
.d-flex
  display: flex
  align-items: center
</style>

<style>
.talent-sp-dialog {
  width: 350px
}
</style>
