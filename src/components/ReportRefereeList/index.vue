<template>
  <section class="referee">
    <el-row class="content header">
      <el-col :span="4" />
      <el-col :span="20" style="display: flex;align-items: center">
        <div class="referee-column" style="width: 130px">
          [時期]関係性
        </div>
        <div class="referee-column" style="width: 200px">
          一緒に仕事をした<span class="non-break">期間</span>
        </div>
        <div class="referee-column" style="width: 240px">
          一緒に仕事をしたときの<span class="non-break">推薦者の会社名</span>
        </div>
        <div class="referee-column" style="width: 240px">
          一緒に仕事をしたときの<span class="non-break">推薦者の職種</span>
        </div>
        <div class="referee-column" style="width: 200px">
          所属
        </div>
      </el-col>
    </el-row>
    <el-row v-for="(referee, i) in referees" :key="i" :gutter="20" class="referee-row">
      <el-col :span="4">
        <span class="name">{{ referee.name }} </span>
        <el-tag v-if="referee.completedAt" size="small" type="success" effect="dark" style="font-weight: bold">完了</el-tag>
        <el-tag v-else-if="referee.answer" size="small" effect="dark" style="font-weight: bold">途中</el-tag>
        <el-tag v-else size="small" type="info">未回答</el-tag>
      </el-col>
      <el-col :span="20" style="display: flex">
        <div class="referee-column" style="width: 130px">
          <p>[{{ getTimeWorkingTogetherLabel(referee) }}]<span class="non-break">{{ getRelationshipLabel(referee) }}</span></p>
        </div>
        <div class="referee-column" style="width: 200px">
          <p>{{ getDuration(referee) }}</p>
        </div>
        <div class="referee-column" style=" width: 240px">
          <p>{{ referee.company }}</p>
        </div>
        <div class="referee-column" style=" width: 240px">
          <p>{{ getJobCategoryLavel(referee.jobCategory) }}</p>
        </div>
        <div class="referee-column" style="width: 200px">
          <p>{{ referee.belongs }}</p>
        </div>
      </el-col>
    </el-row>
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
    getJobCategoryLavel(jobCategory) {
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
  .referee-column
    color: #909399
.referee
  padding-bottom: -10px
  &-row
    padding-top: 16px
    padding-bottom: 8px
    display: flex
    &+&
      border-top: 1px solid #EBEEF5
  &-column
    &+&
      margin-left: 16px
    p
      margin-top: 0
      margin-bottom: 0
      color: #606266
      font-size: 14px
.name
  font-weight: bold
  color: #606266
  margin-top: 0
  margin-bottom: 4px
.content
  display: flex
</style>
