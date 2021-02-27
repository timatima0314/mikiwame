<template>
  <el-card v-loading="loading">
    <hr>
    <p class="text-bold">回答内容をご確認いただき、よろしければ回答を送信してください</p>

    <el-form label="top">
      <div v-if="talent.excusesToRegainTrust.fromReferees">
        <div v-for="(fromReferee, i) in talent.excusesToRegainTrust.fromReferees" :key="i">
          <p>({{ i + 1 }}/{{ talent.excusesToRegainTrust.fromReferees.length }}) {{ fromReferee.text }}</p>
          <el-form-item
            v-for="(answer, j) in fromReferee.answers"
            :key="j"
            :label="'推薦者様（匿名）のご回答：' + answer.text"
          >
            <el-input v-model="answer.excuse" type="textarea" :rows="2" :disabled="true" />
          </el-form-item>
          <el-divider />
        </div>
      </div>

      <template v-if="talent.excusesToRegainTrust.fromCompany.text">
        <p>{{ company.name }}様からの質問</p>
        <el-form-item :label="talent.excusesToRegainTrust.fromCompany.text">
          <el-input
            v-model="talent.excusesToRegainTrust.fromCompany.excuse"
            type="textarea"
            :rows="2"
            :disabled="true"
          />
        </el-form-item>
      </template>
    </el-form>

    <div class="centerize">
      <el-button type="info" @click="goBack">戻って回答を修正</el-button>
      <el-button type="info" @click="gotoNext">回答内容を確認し送信</el-button>
    </div>
  </el-card>
</template>

<script>
import { regainTrustPageMixin } from './mixin/regainTrustPageMixin'

export default {
  name: 'RegainTrustConfirm',
  mixins: [regainTrustPageMixin],
  async created() {
    await this.setup()
  },
  methods: {
    async gotoNext() {
      this.toggleLoading()
      this.confirmExcuses()
        .then(() => {
          this.$router.push({ name: 'regainTrustComplete', query: this.$route.query })
        })
        .catch(this.notifyError)
        .finally(this.toggleLoading)
    },
    goBack() {
      this.toggleLoading()
      this.$router.push({ name: 'regainTrustExcuse', query: this.$route.query })
      this.toggleLoading()
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
.label-font
  font-weight: bold
  margin-bottom: 10px
  font-size: .9rem
  color: #606266
</style>
