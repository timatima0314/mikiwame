<template>
  <div v-loading="loading">
    <el-card>
      <p style="font-size: 0.8rem">
        1.推薦者からの回答に対して、具体的に回答してください。<br>
        2.人事からの質問に対してわかりやすく回答することでより相互理解が深まります。
      </p>
      <hr>
      <p class="text-bold">1.{{ company.name }}様より、{{ talent.name }}様へリファレンスチェックの内容について説明しましょう</p>

      <el-form ref="form" :model="talent" label-position="top">
        <div v-if="talent.excusesToRegainTrust.fromReferees" class="inner">
          <div v-for="(fromReferee, i) in talent.excusesToRegainTrust.fromReferees" :key="i">
            <p>({{ i + 1 }}/{{ talent.excusesToRegainTrust.fromReferees.length }}) {{ fromReferee.text }}</p>
            <el-form-item
              v-for="(answer, j) in fromReferee.answers"
              :key="j"
              :label="'推薦者様（匿名）のご回答：' + answer.text"
              :prop="`excusesToRegainTrust.fromReferees[${i}].answers[${j}].excuse`"
              :rules="rules.excuse"
            >
              <el-input v-model="answer.excuse" type="textarea" :rows="2" />
            </el-form-item>
            <el-divider />
          </div>
        </div>

        <template v-if="talent.excusesToRegainTrust.fromCompany.text">
          <p class="text-bold">2.{{ company.name }}様からの質問</p>
          <div class="inner">
            <el-form-item
              :label="talent.excusesToRegainTrust.fromCompany.text"
              :prop="'excusesToRegainTrust.fromCompany.excuse'"
              :rules="rules.excuse"
            >
              <el-input
                v-model="talent.excusesToRegainTrust.fromCompany.excuse"
                type="textarea"
                :rows="2"
              />
            </el-form-item>
          </div>
        </template>
      </el-form>

      <div class="centerize">
        <el-button type="info" @click="gotoNext">回答を保存して次へ</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
/**
 * /talent?company=<company_id>&token=<token>
 */
import { regainTrustPageMixin } from './mixin/regainTrustPageMixin'
export default {
  name: 'RegainTrustExcuse',
  mixins: [regainTrustPageMixin],
  async created() {
    await this.setup()
  },
  methods: {
    async gotoNext() {
      // this.$notify({ type: 'error', title: 'Error', message: '記入されていない回答欄がございます' })

      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) return

      this.toggleLoading()
      this.saveExcuses()
        .then(() => {
          this.$router.push({ name: 'regainTrustConfirm', query: this.$route.query })
        })
        .catch(this.notifyError)
        .finally(this.toggleLoading)
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
.inner
  margin: 0 1rem
</style>
