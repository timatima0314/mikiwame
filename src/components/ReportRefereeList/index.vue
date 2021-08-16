<template>
  <section class="referee">
    <div class="header">
      <div class="column name-status" />
      <div class="column relationship">
        [時期]関係性
      </div>
      <div class="column duration">
        一緒に仕事をした<span class="non-break">期間</span>
      </div>
      <div class="column company">
        一緒に仕事をしたときの<span class="non-break">推薦者の会社名</span>
      </div>
      <div class="column jobCategory">
        一緒に仕事をしたときの<span class="non-break">推薦者の職種</span>
      </div>
      <div class="column belongs">
        所属
      </div>
    </div>
    <div v-for="(referee, i) in referees" :key="i" class="row">
      <div class="column name-status">
        <span class="name">{{ referee.name }} </span>
        <el-tag v-if="referee.completedAt" type="success" effect="dark">完了</el-tag>
        <el-tag v-else-if="referee.answer" effect="dark">途中</el-tag>
        <el-tag v-else type="info">未回答</el-tag>
      </div>
      <div class="column relationship">
        [{{ getTimeWorkingTogetherLabel(referee) }}]<span class="non-break">{{ getRelationshipLabel(referee) }}</span>
      </div>
      <div class="column duration">
        {{ getDuration(referee) }}
      </div>
      <div class="column company">
        {{ referee.company }}
      </div>
      <div class="column jobCategory">
        {{ getJobCategoryLabel(referee.jobCategory) }}
      </div>
      <div class="column belongs">
        {{ referee.belongs }}
      </div>
    </div>
  </section>
</template>

<script>
import arrayTreeFilter from 'array-tree-filter'
import dayjs from 'dayjs'
import get from 'lodash/get'
import { statusProperty } from '@/constants/status'
import {
  getJobCategoryOptionsByLang,
  getRelationshipOptionsByLang,
  getTimeWorkingOptionsByLang
} from '@/constants/options'

const getLabel = (options, target) => get(options.find(elem => elem.value === target), 'label')

export default {
  name: 'ReportRefereeList',
  props: {
    referees: {
      type: Array,
      default: () => {
        [{
          name: '',
          belongs: '',
          email: '',
          completedAt: null,
          company: '',
          jobCategory: '',
          answer: null,
          otherTimeWorkingTogether: '',
          otherRelationship: '',
          relationship: '',
          timeWorkingTogether: '',
          timeToBeginWorkingTogether: '',
          timeToEndWorkingTogether: ''
        }]
      }
    }
  },
  data: () => {
    return {
      statusProperty
    }
  },
  computed: {
    options: () => ({
      relationshipOptions: getRelationshipOptionsByLang(),
      timeWorkingOptions: getTimeWorkingOptionsByLang(),
      jobCategoryOptions: getJobCategoryOptionsByLang()
    })
  },
  methods: {
    getDuration(referee) {
      const { timeToBeginWorkingTogether: beginDate, timeToEndWorkingTogether: endDate } = referee
      const beginStr = beginDate ? dayjs(beginDate).format('YYYY/MM/DD') : ''
      const endStr = endDate ? dayjs(endDate).format('YYYY/MM/DD') : ''
      return `${beginStr} ~ ${endStr}`
    },
    getJobCategoryLabel(jobCategory) {
      const getFilteredArray = (target, values) => {
        return arrayTreeFilter(
          target,
          (item, level) => item.value === values[level]
        )
      }
      return getFilteredArray(this.options.jobCategoryOptions, jobCategory)
        .map(x => x.label)
        .join(' / ')
    },
    getRelationshipLabel(referee) {
      if (referee.relationship === 'other') {
        return referee.otherRelationship
      }
      return getLabel(this.options.relationshipOptions, referee.relationship)
    },
    getTimeWorkingTogetherLabel(referee) {
      if (referee.relationship === 'other') {
        return referee.otherTimeWorkingTogether
      }
      return getLabel(this.options.timeWorkingOptions, referee.timeWorkingTogether)
    }
  }
}
</script>

<style lang="sass" scoped>
.non-break
  word-break: keep-all
.header
  display: flex
  align-items: center
  font-size: 0.85rem
  font-weight: bold
  color: #909399
.row
  display: flex
  padding: 16px 0 8px
  color: #606266
  font-size: 14px
  &+&
    border-top: 1px solid #EBEEF5
.name-status
  flex: 1 0 180px
  font-weight: bold
.relationship
  flex: 1 1 130px
.duration
  flex: 1 1 200px
.company
  flex: 1 1 240px
.jobCategory
  flex: 1 1 240px
.belongs
  flex: 1 1 200px
.name
  font-size: 16px
  color: #606266
.column
  &+&
    margin-left: 16px
</style>
