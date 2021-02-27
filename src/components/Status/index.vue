<template>
  <el-tag plain v-bind="buttonProps" class="status">
    {{ text }}
  </el-tag>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
      validator: v => ['done', 'analyzing'].includes(v)
    }
  },
  computed: {
    buttonProps() {
      const type = {
        done: 'success',
        analyzing: 'info'
      }

      return {
        type: type[this.status]
      }
    },
    text() {
      const text = {
        done: '完了',
        analyzing: '解析中'
      }
      return text[this.status]
    }
  }
}
</script>

