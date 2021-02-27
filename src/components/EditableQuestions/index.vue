<template>
  <div>
    <div v-for="(question, i) in questions" :key="i">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col>
          <p class="strong font-big" style="display: flex; text-align: left">
            <span>{{ i + 1 }}.</span>
            <el-input v-if="editingQuestionKey === question.key" v-model="question.text" />
            <span v-else>{{ question.text }}</span>
          </p>
        </el-col>
        <el-col v-if="isEditableQuestions" :span="4">
          <el-button v-if="editingQuestionKey === question.key" type="primary" icon="el-icon-check" circle @click="editingQuestionKey = null" />
          <el-button v-else type="success" icon="el-icon-edit" circle @click="editingQuestionKey = question.key" />
          <el-button type="primary" icon="el-icon-delete" circle @click="deleteQuestion(i)" />
        </el-col>
      </el-row>
      <hr style="border-style: dashed; color: grey">
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditableQuestions',
  props: {
    questions: { type: Array, default: () => [] },
    isEditableQuestions: { type: Boolean, default: false }
  },
  data: () => ({
    editingQuestionKey: null // 編集中の質問がないときはnull
  }),
  methods: {
    deleteQuestion(index) {
      // TODO: propsを変更するのは良くないが、一旦これで
      this.questions.splice(index, 1)
    }
  }
}
</script>
