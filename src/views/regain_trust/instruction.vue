<template>
  <div v-loading="loading">
    <p><span class="text-bold">{{ talent.name }}</span>様</p>
    <p>リファレンスチェックの内容について確認依頼</p>

    <el-card class="mt-1">
      <h2>リファレンスチェックのコミュニケーション機能について</h2>
      <div class="description">
        <p>{{ company.name }}様から、推薦者が回答した内容について確認依頼が来ております。</p>
        <p>担当者様からの質問内容に対し、説明を行ってください。</p>
        <!-- （文言要修正） -->
      </div>

      <hr>

      <h2>ご利用の流れ</h2>
      <el-steps direction="vertical" :active="3">
        <el-step title="説明">
          <p slot="description" class="step-text">リファレンスチェックの質問回答内容に対し、説明をご入力いただきます。</p>
        </el-step>
        <el-step title="内容確認">
          <p slot="description" class="step-text">ご入力していただいた内容に間違いがないかご確認いただきます。</p>
        </el-step>
        <el-step title="送信">
          <p slot="description" class="step-text">ご入力内容を{{ company.name }}様に送信いたします。</p>
        </el-step>
      </el-steps>

      <RegainTrustDeadline :date="talent.excuseDeadline" />

      <hr>

      <div class="mt-1 centerize">
        <el-button type="primary" :disabled="!talent.isAgreeToPrivacyPolicy" @click="gotoNext">次へ</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { regainTrustPageMixin } from './mixin/regainTrustPageMixin'
import RegainTrustDeadline from '@/components/RegainTrustDeadline'
export default {
  name: 'Instruction',
  components: { RegainTrustDeadline },
  mixins: [regainTrustPageMixin],
  async created() {
    await this.setup()
  },
  methods: {
    gotoNext() {
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
  justify-content: center
.pull-right
  margin-left: auto
.d-flex
  display: flex
  align-items: center
.description
  padding-left: 1rem
time
  color: #1a86f5
  font-size: 1.2em
  font-weight: bold
.step-text
  color: #303133
hr
  margin-bottom: 2rem
</style>
