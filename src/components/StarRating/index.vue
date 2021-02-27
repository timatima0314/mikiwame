<template>
  <span>
    <i v-for="i in times" :key="i" class="el-icon-star-on" />
  </span>
</template>

<script>
import range from 'lodash/range'

export default {
  props: { rate: { type: Number, default: 0 }},
  computed: {
    times() {
      return range(0, this.rate)
    }
  }
}
</script>
