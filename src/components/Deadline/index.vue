<template>
  <div class="container">
    <div>
      <p class="strong">{{ refereeI18n.t('message.referenceCollectionDeadline') }}</p>
      <p class="strong font-big">{{ deadlineString }}</p>
    </div>
    <div>
      <span>{{ refereeI18n.t('message.timeForReferences') }}:</span>
      <time class="strong">{{ commonI18n.t('message.about') }}{{ estimatedMinutes }}{{ commonI18n.t('message.minutes') }}</time>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { defaultDeadline } from '@/constants/date'
import { getI18n } from '@/constants/i18n'

export default {
  name: 'Deadline',
  props: {
    date: { type: Date, default: () => defaultDeadline },
    estimatedMinutes: { type: Number, required: true },
    language: { type: String, default: 'jp' }
  },
  computed: {
    deadlineString() {
      if (this.language === 'jp') return dayjs(this.date).format('YYYY年MM月DD日')
      else return dayjs(this.date).format('DD/MM/YYYY')
    },
    refereeI18n() {
      const i18n = getI18n('referee')
      i18n.locale = this.language
      return i18n
    },
    commonI18n() {
      const i18n = getI18n('common')
      i18n.locale = this.language
      return i18n
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
