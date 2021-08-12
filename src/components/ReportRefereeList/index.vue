<template>
  <el-card shadow="never" class="card-entire referee">
    <span class="card-title">
      <i class="el-icon-user" />
      推薦者
    </span>

    <el-row v-for="(referee, i) in referees" :key="i" :gutter="20" class="referee-row">
      <el-col :span="4">
        <h4 style="margin-top: 4px">{{ referee.name }}</h4>
        <el-tag v-if="referee.completedAt" type="success" effect="dark" style="font-weight: bold">完了</el-tag>
        <el-tag v-else-if="referee.answer" effect="dark" style="font-weight: bold">途中</el-tag>
        <el-tag v-else type="info">未回答</el-tag>
      </el-col>
      <el-col :span="20">
        <el-row :gutter="10">
          <el-col :span="8" class="referee-column">
            <span class="small">所属</span>
            <p>{{ referee.belongs }}</p>
          </el-col>
          <el-col :span="8" class="referee-column">
            <span class="small">【時期】関係性</span>
            <p>【{{ getTimeWorkingTogetherLabel(referee) }}】{{ getRelationshipLabel(referee) }}</p>
          </el-col>
          <el-col :span="8" class="referee-column" style="word-break: break-all">
            <span class="small">メールアドレス</span>
            <p>{{ referee.email }}</p>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8" class="referee-column">
            <span class="small">一緒に仕事をした期間</span>
            <p>{{ getDuration(referee) }}</p>
          </el-col>
          <el-col :span="8" class="referee-column">
            <span class="small">一緒に仕事をしたときの推薦者の職種</span>
            <p>{{ getJobCategoryLavel(referee.jobCategory) }}</p>
          </el-col>
          <el-col :span="8" class="referee-column">
            <span class="small">一緒に仕事をしたときの推薦者の会社名</span>
            <p>{{ referee.company }}</p></el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
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
.card-entire
  margin-top: 1rem
  margin-right: 1rem /*pdfで右を見切れさせない*/
  border: solid
  border-color: #C0C4CC
.card-title
  font-size: 1.3rem
  &:nth-child(n + 2)
    margin-top: 1rem
.referee
  padding-bottom: -10px
  &-row
    padding-top: 16px
    padding-bottom: 8px
    &+&
      border-top: 1px solid lightgray
  &-column
    span
      color: #909399
    p
      margin-top: 8px
.small
  font-size: 0.9rem
.card-status
  font-weight: 600
  padding: 4px 8px
  border-radius: 4px
  color: #fff
</style>
