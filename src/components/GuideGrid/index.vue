<template>
  <div>
    <el-row justify="space-between">
      <el-col :span="8" class="container-center">
        <a href="https://storage.googleapis.com/mikiwame-prod.appspot.com/files/mikiwame_point_guide.pdf" target="_blank" class="highlight-button">候補者様の追加手順</a>
      </el-col>
      <el-col :span="8" class="container-center">
        <a href="https://www.youtube.com/watch?v=zvycQEldwWY" target="_blank" class="highlight-button">MiKiWaMe Point Movie</a>
      </el-col>
      <el-col :span="8" class="container-center">
        <a href="#" class="highlight-button">求職者様用ガイドMovie<br>Coming soon</a>
      </el-col>
    </el-row>
    <el-row justify="space-between">
      <el-col :span="8" class="container-center">
        <a href="https://storage.googleapis.com/mikiwame-prod.appspot.com/files/mikiwame_point_guide_for_talent.pdf" target="_blank" class="highlight-button">候補者様・ガイド</a>
      </el-col>
      <el-col :span="8" class="container-center">
        <a href="https://storage.googleapis.com/mikiwame-prod.appspot.com/files/mikiwame_point_guide_for_agent.pdf" target="_blank" class="highlight-button">エージェント様・ガイド</a>
      </el-col>
      <el-col :span="8" class="container-center">
        <a href="https://storage.googleapis.com/mikiwame-prod.appspot.com/files/mikiwame_point_guide_config.pdf" target="_blank" class="highlight-button">推薦者の証明画像、Free Mail<br>有効・無効設定</a>
      </el-col>
    </el-row>
    <el-row justify="space-between">
      <el-col :span="8" class="container-center">
        <a href="#" class="highlight-button">質問作成ガイド<br>Coming soon</a>
      </el-col>
      <el-col :span="8" class="container-center">
        <a href="https://storage.googleapis.com/mikiwame-prod.appspot.com/files/mikiwame_point_guide_risk_check.pdf" target="_blank" class="highlight-button">反社チェックガイド</a>
      </el-col>
      <el-col :span="8" class="container-center">
        <a href="#" class="highlight-button">Coming soon</a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'GuideGrid'
}
</script>

<style lang="scss" scoped>
.container-center{
  margin-top: 2rem;
  display:flex;
  align-items:center;
  justify-content:center;
}
.highlight-button {
  text-align: center;
  color: #00004c;
  font-weight: bold;
  font-size: 90%;
  border: 2px dotted #00004c;
  border-radius: 10px;
  padding: 0.8rem;
  width: 85%;
  height: 5rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
