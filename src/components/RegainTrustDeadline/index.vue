<template>
  <div class="container">
    <div>
      <p class="strong">回答期日</p>
      <p class="strong font-big">{{ deadlineString }}</p>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { defaultDeadline } from '@/constants/date'

export default {
  name: 'RegainTrustDeadline',
  props: {
    date: { type: Date, default: () => defaultDeadline }
  },
  computed: {
    deadlineString() {
      return dayjs(this.date).format('YYYY年MM月DD日')
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  background-color: #f6f7fa
  border-radius: .6rem
  padding: 2rem 0
  text-align: center
  .strong
    color: #1a86f5
    font-weight: bold
  .font-big
    font-size: 1.3rem
</style>
