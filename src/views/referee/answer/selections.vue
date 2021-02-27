<template>
  <div v-loading="loading">
    <el-card>
      <el-button v-if="descriptionsLength !== 0" icon="el-icon-back" @click="goBack">{{ refereeI18n.t('message.returnToDescriptionQuestions') }}</el-button>
      <p>{{ refereeI18n.t('message.requestForSelections', { honorific: commonI18n.t('message.honorific', { name: talent.name }) }) }}</p>
      <hr>
      <p class="text-bold">{{ refereeI18n.t('message.selectionQuestions') }}({{ refereeI18n.t('message.numberOfQuestions', { number: selectionsLength }) }})</p>
      <el-form
        ref="form"
        :model="answer"
      >
        <el-form-item
          v-for="(question, i) in selectionQuestions"
          :key="i"
          :prop="`selections[${question.key}]`"
          :label="`(${i+1}/${selectionsLength})${question.text}`"
          :rules="rules.selectionAnswer"
        >
          <el-radio-group v-model="answer.selections[question.key]">
            <div v-if="selectionPatterns.positivePattern.includes(question.key)">
              <el-radio
                v-for="([text, value], j) in zip(radioSelectionText[preferredLang], radioSelectionScore)"
                :key="j"
                :label="value"
                :class="$mq === 'pc' ? '' : 'radio-sp'"
              >
                {{ text }}
              </el-radio>
            </div>
            <div v-else-if="selectionPatterns.negativePattern.includes(question.key)">
              <el-radio
                v-for="([text, value], j) in zip(radioSelectionText[preferredLang], radioSelectionScore.slice().reverse())"
                :key="j"
                :label="value"
                :class="$mq === 'pc' ? '' : 'radio-sp'"
              >
                {{ text }}
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="mt-1 centerize">
        <el-button type="info" @click="onClickSave">{{ commonI18n.t('message.saveYourAnswer') }}</el-button>
        <el-button type="primary" @click="goNext">{{ commonI18n.t('message.sendYourAnswerToNext') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
/**
 * /talent?company=<company_id>&token=<token>
 */
import Vue from 'vue'
import VueMq from 'vue-mq' // PCかモバイルを判断
import { refereePageMixin } from '../mixin/refereePageMixin'
import { functions } from '@/plugins/firebase'
import zip from 'lodash/zip'

const breakpoints = {
  sp: 800,
  pc: 2000
}

Vue.use(VueMq, { breakpoints })

export default {
  name: 'Referee',
  mixins: [refereePageMixin],
  computed: {
    // 英語と中国語はがばがば，修正求
    degrees() {
      return {
        jp: { high: 'あてはまる', low: 'あてはまらない' },
        en: { high: 'agree', low: 'disagree' },
        cn: { high: '同意', low: '不同意' }
      }[this.preferredLang]
    }
  },
  async created() {
    await this.setup().finally(this.toggleLoading)
    if (this.answer.descriptions === undefined) this.goBack()
  },
  methods: {
    zip,
    goBack() {
      this.pushWithInheritingQuery('answerDescriptions')
    },
    async goNext() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) {
        this.$alert(this.refereeI18n.tc('message.pleaseAnswerAll'))
        return
      }
      this.toggleLoading()
      this.saveAnswer()
        .then(() => {
          const { company: companyId, talent: talentId } = this.$route.query
          functions.httpsCallable('evaluateSelectionAnswers')({ companyId, talentId })

          if (this.isBusinessCardRequired) this.pushWithInheritingQuery('refereeIdentification')
          else this.goCompletePage()
        }).catch(this.notifyError)
    },
    onClickSave() {
      this.saveAnswer()
        .then(() => { this.$alert(this.refereeI18n.tc('message.savedAnswer')) })
        .catch(this.notifyError)
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
/deep/ .el-form-item__label
  text-align: left
  line-height: initial
  float: initial
.radio-sp
  margin-top: 5px
  margin-bottom: 5px
  margin-right: 110%
</style>
