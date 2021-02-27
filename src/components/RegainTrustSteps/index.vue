<template>
  <div class="wrapper">
    <el-steps :active="stepNumber" align-center finish-status="success">
      <el-step title="依頼内容と説明" />
      <el-step title="確認依頼" />
      <el-step title="内容確認" />
      <el-step title="完了" />
    </el-steps>
  </div>
</template>

<script>

const STEPS = {
  regainTrustInstruction: 0,
  regainTrustExcuse: 1,
  regainTrustConfirm: 2,
  // すべてのステップにチェックをいれて、コミュニケーション機能が完了したことを伝えるため通常よりも1大きい値を返す
  regainTrustComplete: 4
}

export default {
  name: 'RegainTrustSteps',
  computed: {
    stepNumber() {
      return STEPS[this.$route.name]
    }
  }
}
</script>

<style lang="sass" scoped>
.wrapper
  margin-bottom: 1rem
</style>
