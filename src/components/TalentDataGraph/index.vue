<template>
  <div>
    <el-date-picker
      v-model="conditions.dateRange"
      type="daterange"
      unlink-panels
      range-separator="～"
      start-placeholder="絞り込み日付"
      end-placeholder="絞り込み日付"
      :picker-options="dateRangePickerOptions"
      style="margin-bottom: 4px;"
    />
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card style="border-radius: 30px; height: 230px;" shadow="always">
          <div style="font-size: 18px; font-weight: 900; margin-bottom: 30px; text-align: center;">件数</div>
          <div class="talent-number">
            {{ filteredTalents.length }}件
            <div><i class="el-icon-s-data" /></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="border-radius: 30px; height: 230px;" shadow="always">
          <vue-apex-charts
            :options="appliedSiteChart.options"
            :series="appliedSiteChart.series"
            @dataPointSelection="appliedSiteDataPointSelectionHandler"
          />
          <div class="reset-button">
            <el-button
              type="danger"
              size="mini"
              round
              :disabled="!conditions.appliedSite.value"
              @click="resetAppliedSiteDataPointSelection"
            >
              リセット
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="border-radius: 30px; height: 230px;" shadow="always">
          <vue-apex-charts
            :options="evaluationChart.options"
            :series="evaluationChart.series"
            @dataPointSelection="evaluationDataPointSelectionHandler"
          />
          <div class="reset-button">
            <el-button
              type="danger"
              size="mini"
              round
              :disabled="!conditions.evaluation.value"
              @click="resetEvaluationDataPointSelection"
            >
              リセット
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="border-radius: 30px; height: 230px;" shadow="always">
          <vue-apex-charts
            :options="occupationChart.options"
            :series="occupationChart.series"
            @dataPointSelection="occupationDataPointSelectionHandler"
          />
          <div class="reset-button">
            <el-button
              type="danger"
              size="mini"
              round
              :disabled="!conditions.occupation.value"
              @click="resetOccupationDataPointSelection"
            >
              リセット
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import get from 'lodash/get'
import zip from 'lodash/zip'
import { getJobCategoryOptionsByLang, getAppliedSiteOptions } from '@/constants/options'
import { getDefaultGraphOptions } from '@/constants/graph_options'
import dayjs from 'dayjs'

// prop
// > talents: 絞り込む前の候補者群
// emit
// > filteredTalentsListener: 絞り込み後の候補者群を受け取るmethod
export default {
  name: 'TalentDataGraph',
  components: { VueApexCharts },
  props: {
    talents: { type: Array, default: null }
  },
  data() {
    return {
      // 絞り込み条件
      // value: 絞り込む条件の値
      // グラフ上での色(evaluetionのみcomputedで独自に定義されているため省略)
      conditions: {
        appliedSite: {
          color: '',
          value: ''
        },
        evaluation: { value: '' },
        occupation: {
          color: '',
          value: ''
        },
        dateRange: ''
      }
    }
  },
  computed: {
    // グラフとDatePickerで絞り込まれた候補者群
    filteredTalents() {
      // 期間で絞ってから条件で絞る
      const fileteredTalentByDateRange = this.conditions.dateRange
        ? this.talents.filter(talent => {
          if (!talent.createdAt) return false
          const createdAt = talent.createdAt.toDate()
          // [0]: start, [1]: end
          return createdAt >= this.conditions.dateRange[0] && createdAt <= this.conditions.dateRange[1]
        })
        : this.talents

      // 期間に加えて条件でも絞り込む
      const filteredTalentByAllCondition = fileteredTalentByDateRange.filter(talent => {
        // 応募媒体
        if (this.conditions.appliedSite.value && !talent.siteWhereTalentApplied?.includes(this.conditions.appliedSite.value)) return false
        // 評価分析(「離」のみ扱いが特殊なため条件追加)
        if (this.conditions.evaluation.value === '離') {
          if (talent.status === 'refereesAnswered' || !dayjs().isAfter(dayjs(talent.deadline?.toDate()).add(60, 'day'))) return false
        } else if (this.conditions.evaluation.value && !talent.evaluation?.totalScore?.includes(this.conditions.evaluation.value)) {
          return false
        }
        // 職種別
        if (this.conditions.occupation.value && !talent.currentJobCategory?.includes(this.conditions.occupation.value)) return false
        return true
      })

      // 親に絞り込んだ候補者群を返す
      this.$emit('filteredTalentsListener', filteredTalentByAllCondition)

      return filteredTalentByAllCondition
    },
    appliedSiteChart() {
      const { series, options } = this.getSeriesAndOptions('siteWhereTalentApplied', getAppliedSiteOptions, '応募媒体')
      // 絞り込みの条件があればその条件のグラフ色を反映
      if (this.conditions.appliedSite.value) options.colors[0] = this.conditions.appliedSite.color
      return { series, options }
    },
    evaluationChart() {
      const options = getDefaultGraphOptions()
      options.title.text = '評価分析'
      const chartNums = { A: 0, B: 0, C: 0, D: 0, E: 0, 離: 0 }
      this.filteredTalents.forEach(talent => {
        const evaluation = get(talent, 'evaluation.totalScore')
        if (evaluation) { chartNums[evaluation]++ }
        const withdrawal = dayjs().isAfter(dayjs(talent.deadline?.toDate()).add(60, 'day'))
        if (talent.status !== 'refereesAnswered' && withdrawal) { chartNums['離']++ }
      })
      const series = Object.values(chartNums)
      if (series.every(num => num === 0)) return { series: [], options }
      options.chart.width = 220
      options.labels = Object.keys(chartNums)
      return { series, options }
    },
    occupationChart() {
      const { series, options } = this.getSeriesAndOptions('currentJobCategory', getJobCategoryOptionsByLang, '職種別')
      // 絞り込みの条件があればその条件のグラフ色を保存
      if (this.conditions.occupation.value) options.colors[0] = this.conditions.occupation.color
      return { series, options }
    },
    // datepickerの絞り込みボタン設定
    dateRangePickerOptions() {
      return {
        shortcuts: [{
          text: '昨日',
          onClick(picker) {
            picker.$emit('pick', [dayjs().subtract(1, 'days').toDate(), dayjs().toDate()])
          }
        }, {
          text: '先週',
          onClick(picker) {
            picker.$emit('pick', [dayjs().subtract(1, 'weeks').toDate(), dayjs().toDate()])
          }
        }, {
          text: '先月',
          onClick(picker) {
            picker.$emit('pick', [dayjs().subtract(1, 'months').toDate(), dayjs().toDate()])
          }
        }]
      }
    }
  },
  methods: {
    // グラフのlegend(グラフの横のラベルみたいなやつ)をクリックすると動作
    // config.dataPointIndex : クリックされたやつのlabelのindex
    appliedSiteDataPointSelectionHandler(event, chartContext, config) {
      // 円グラフ自体をクリックで正
      // 円グラフ自体をクリックしてemitすると謎エラーがでるためreturn
      if (event) return

      // 絞り込み条件のラベルと対応したvalueを保存
      this.conditions.appliedSite.value = getAppliedSiteOptions().find(option =>
        option.label === this.appliedSiteChart.options.labels[config.dataPointIndex]
      ).value
      // 絞り込み条件の色を保存
      this.conditions.appliedSite.color = getDefaultGraphOptions().colors[(config.dataPointIndex % getDefaultGraphOptions().colors.length)]
    },
    // 絞り込み条件をリセット
    resetAppliedSiteDataPointSelection() {
      this.conditions.appliedSite.value = ''
    },
    evaluationDataPointSelectionHandler(event, chartContext, config) {
      if (event) return
      this.conditions.evaluation.value = this.evaluationChart.options.labels[config.dataPointIndex]
    },
    resetEvaluationDataPointSelection() {
      this.conditions.evaluation.value = ''
    },
    occupationDataPointSelectionHandler(event, chartContext, config) {
      if (event) return

      this.conditions.occupation.value = getJobCategoryOptionsByLang().find(option =>
        option.label === this.occupationChart.options.labels[config.dataPointIndex]
      ).value
      this.conditions.occupation.color = getDefaultGraphOptions().colors[(config.dataPointIndex % getDefaultGraphOptions().colors.length)]
    },
    resetOccupationDataPointSelection() {
      this.conditions.occupation.value = ''
    },
    // 職業別と応募媒体のグラフのoptionとseriesを算出
    getSeriesAndOptions(query, getFunc, text) {
      const options = getDefaultGraphOptions()
      const data = {}
      options.title.text = text
      this.filteredTalents.forEach(talent => {
        if (!talent[query]) return
        const [talentData] = talent[query]
        data[talentData] ? data[talentData]++ : data[talentData] = 1
      })
      if (!Object.values(data).length) return { series: [], options }
      // 降順にソートして、top10を切り取る
      const [values, series] = zip(...Object.entries(data).sort(([, a], [, b]) => b - a).slice(0, 10))
      const labels = values.map(value => getFunc().find(fetchedData => fetchedData.value === value).label)
      options.chart.width = 220
      options.labels = labels

      return { series, options }
    }
  }
}
</script>

<style lang="sass" scoped>
.talent-number
  font-size: 40px
  text-align: center
  font-weight: bold
.el-icon-s-data
  margin-top: 15px
  color: #827af3
  font-size: 40px
.reset-button
  text-align: center
  margin-top: 5px
</style>

