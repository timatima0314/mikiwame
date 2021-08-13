<template>
  <section class="referee">
    <el-row v-for="(referee, i) in referees" :key="i" :gutter="20" class="referee-row">
      <el-col :span="3">
        <h4 class="name">{{ referee.name }}</h4>
        <el-tag v-if="referee.completedAt" type="success" effect="dark" style="font-weight: bold">完了</el-tag>
        <el-tag v-else-if="referee.answer" effect="dark" style="font-weight: bold">途中</el-tag>
        <el-tag v-else type="info">未回答</el-tag>
      </el-col>
      <el-col :span="21">
        <el-row class="content header">
          <div class="referee-column" style="width: 150px">
            【時期】関係性
          </div>
          <div class="referee-column" style="width: 195px">
            一緒に仕事をした期間
          </div>
          <div class="referee-column" style="width: 240px">
            一緒に仕事をしたときの推薦者の会社名
          </div>
          <div class="referee-column" style="width: 240px">
            一緒に仕事をしたときの推薦者の職種
          </div>
          <div class="referee-column" style="width: 200px">
            所属
          </div>
        </el-row>
        <el-row class="content">
          <div class="referee-column" style="width: 150px">
            <p>【{{ getTimeWorkingTogetherLabel(referee) }}】{{ getRelationshipLabel(referee) }}</p>
          </div>
          <div class="referee-column" style="width: 195px">
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
        </el-row>
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

// モックを差し替え
// PR作る
// 下の方に関係性追加

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
      statusProperty,
      options: {
        relationshipOptions: getRelationshipOptionsByLang(),
        timeWorkingOptions: getTimeWorkingOptionsByLang(),
        jobCategoryOptions: getJobCategoryOptionsByLang()
      }
    }
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
.header
  display: flex;
  align-items: center;
  font-size: 0.85rem
  .referee-column
    color: #909399
.referee
  word-break: break-all
  padding-bottom: -10px
  &-row
    padding-top: 16px
    padding-bottom: 8px
    display: flex
    &+&
      border-top: 1px solid lightgray
  &-column
    &+&
      margin-left: 18px
    p
      margin-top: 8px
      margin-bottom: 0
.name
  margin-top: 0
  margin-bottom: 4px
.content
  display: flex
</style>
