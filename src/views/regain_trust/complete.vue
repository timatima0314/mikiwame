<template>
  <div v-loading="loading">
    <el-card>
      <p><span style="font-weight: bold">{{ talent.name }}</span>様</p>
      <p class="thanks">質問内容に対する説明ありがとうございました</p>
      <p>ご回答頂きました情報は厳重に管理させていただきます。</p>
    </el-card>
  </div>
</template>

<script>
import { regainTrustPageMixin } from './mixin/regainTrustPageMixin'
export default {
  name: 'RegainTrustComplete',
  mixins: [regainTrustPageMixin],
  async created() {
    await this.setup()
  }
}
</script>

<style lang="sass" scoped>
.thanks
  font-weight: bold
  font-size: 1.2rem
  color: #1a86f5
  text-align: center
</style>
