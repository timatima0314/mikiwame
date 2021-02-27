<template>
  <div v-loading="loading">
    <h3>ステータス</h3>
    <el-row :gutter="10" class="progress">
      <el-col :span="6">
        <el-card class="card">
          <div class="title">期日</div>
          <div class="date">
            {{ date.format('YYYY年') }}<br>
            {{ date.format('MM月DD日') }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-steps :active="get(statusProperty[talentData.status], 'stepNum')" align-center finish-status="success">
          <el-step title="メール未送信" />
          <el-step title="メール未開封" />
          <el-step title="推薦者未登録" />
          <el-step title="推薦者未回答" />
          <el-step title="完了" />
        </el-steps>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import get from 'lodash/get'
import { statusProperty } from '@/constants/status'

export default {
  name: 'Status',
  props: {
    loading: { type: Boolean, default: false },
    talentData: {
      type: Object,
      default: () => ({
        name: '',
        email: '',
        id: '',
        deadline: null,
        status: ''
      })
    }
  },
  data: () => ({ statusProperty }),
  computed: {
    date() {
      return dayjs(this.talentData.deadline?.toDate())
    }
  },

  methods: {
    dayjs, get
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.progress {
  margin-top: 25px;
}
.title {
    font-size: 15px;
    color: #fff;
    background-color: $mainButton;
    margin: auto;
    width: 50%;
    padding: 5px;
    border-radius: 8px;
    font-weight: bold;
  }
.date {
  font-size: 20px;
  margin-top: 20px;
  font-weight: bold;
  color: #fff;
}
.card {
  margin-left: 10px;
  text-align: center;
  border-radius: 13px;
  background-color: $backgroundPrimary;
}
</style>
