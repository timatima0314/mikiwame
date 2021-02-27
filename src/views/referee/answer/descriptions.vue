<template>
  <div v-loading="loading">
    <el-card>
      <p>{{ refereeI18n.t('message.requestForDescriptions', { honorific: commonI18n.t('message.honorific', { name: talent.name }) }) }}</p>
      <hr>
      <p class="text-bold">{{ refereeI18n.t('message.descriptionQuestions') }}({{ refereeI18n.t('message.numberOfQuestions', { number: descriptionsLength }) }})</p>
      <el-form
        ref="form"
        :model="answer"
      >
        <el-form-item
          v-for="(question, i) in descriptionQuestions"
          :key="i"
          :prop="`descriptions[${question.key}]`"
          :label="`(${i+1}/${descriptionsLength})${question.text}`"
          :rules="rules.descriptionAnswer"
        >
          <el-input v-model="answer.descriptions[question.key]" type="textarea" />
        </el-form-item>
      </el-form>

      <div class="centerize">
        <el-button type="info" @click="onClickSave">{{ commonI18n.t('message.saveYourAnswer') }}</el-button>
        <el-button type="info" @click="onClickNextStep">{{ commonI18n.t('message.saveYourAnswerToNext') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
/**
 * /talent?company=<company_id>&token=<token>
 */
import { refereePageMixin } from '../mixin/refereePageMixin'

export default {
  name: 'Referee',
  mixins: [refereePageMixin],
  async created() {
    this.setup().finally(this.toggleLoading)
  },
  methods: {
    async onClickNextStep() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) {
        this.$alert(this.refereeI18n.tc('message.pleaseAnswerAll'))
        return
      }
      this.saveAnswer()
        .then(() => { this.pushWithInheritingQuery('answerSelections') })
        .catch(this.notifyError)
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
</style>
