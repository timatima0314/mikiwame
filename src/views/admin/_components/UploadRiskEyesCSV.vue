<template>
  <div>
    <el-select v-model="selectedYYYYMM">
      <el-option v-for="(month, i) in monthOptions" :key="i" :label="month.format('YYYY年MM月分')" :value="month.format('YYYYMM')" />
    </el-select>
    <el-upload action="" :http-request="onUploadCSV" :multiple="false" accept="text/csv" :show-file-list="false" style="display: inline-block">
      <el-button><i class="el-icon-top" />{{ riskEyesCSVfilename }}をアップロード</el-button>
    </el-upload>

    <el-card header="直近3ヶ月のアップロード状況" style="margin-top: 1rem; width: 50%">
      <el-table :data="last3monthsUploadStatus" :show-header="false" size="small">
        <el-table-column prop="month" />
        <el-table-column>
          <template v-slot="{row}">
            <span>
              <i v-if="row.hasUploaded" class="el-icon-check" style="color: green" />
              <i v-else class="el-icon-close" style="color: red" />
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import Papa from 'papaparse'
import { getRiskEyesBillingRefByYYYYMM } from '@/plugins/firebase'
import { RISK_EYES_UNIT_PRICE } from '@/constants/billing'

export default {
  name: 'UploadRiskEyesCSV',
  props: {
    loading: { type: Boolean, required: true }
  },
  data: () => ({
    selectedYYYYMM: dayjs().format('YYYYMM'),
    last3monthsUploadStatus: []
  }),
  computed: {
    // 直近3ヶ月を選択できるようにする
    monthOptions() {
      // e.g. 3月ならば、3月, 2月, 1月のdayjsオブジェクトが返却される
      return [0, 1, 2].map(diff => dayjs().subtract(diff, 'month'))
    },
    selectedYYMM() {
      return this.selectedYYYYMM.slice(2)
    },
    riskEyesCSVfilename() {
      return `riskeyes${this.selectedYYMM}.csv`
    }
  },
  created() {
    this.setLast3monthsUploadStatus()
  },
  methods: {
    async setLast3monthsUploadStatus() {
      this.last3monthsUploadStatus = await Promise.all(
        this.monthOptions.map(async month => {
          const snapshot = await getRiskEyesBillingRefByYYYYMM(month.format('YYYYMM')).get().catch(err => this.$rollbar.error(err))
          const hasUploaded = snapshot && snapshot.exists
          return {
            month: month.format('YYYY年MM月分'),
            hasUploaded
          }
        }))
    },
    onUploadCSV({ file }) {
      this.$emit('update:loading', true)
      this._parseCSV(file).then(this._aggregateByID).then(this._saveAggregation)
        .then(() => {
          this.$notify({
            type: 'success',
            title: 'Success',
            message: 'CSVアップロードが完了しました'
          })
          this.setLast3monthsUploadStatus()
          this.$emit('upload-end')
        }).catch(err => {
          this.$rollbar.error(err)
          this.$notify({
            type: 'error',
            title: 'Error',
            message: err.message && err.message.startsWith('CSV_PARSE_ERROR')
              ? 'CSVの解析に失敗しました。CSVファイルの内容をお確かめください'
              : 'CSVのアップロードに失敗しました。時間をおいて再度お試しください'
          })
        }).finally(() => {
          this.$emit('update:loading', false)
        })
    },
    _parseCSV(file) {
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          encoding: 'Shift-JIS',
          complete: result => {
            if (result.errors.length) {
              reject(new Error(`CSV_PARSE_ERROR: ${result.errors.join()}`))
            }

            // ヘッダー: 利用者ID, 利用者名, 案件ID, 調査種類, 案件区分, 案件名, 利用日, 商品名, 件数, 単価, 金額
            const [[firstHeader], ...billingRows] = result.data // ヘッダーを除いた行を取り出す
            if (firstHeader !== '利用者ID') reject(new Error(`CSV_PARSE_ERROR: invalid header`))

            resolve(billingRows)
          }
        })
      })
    },
    // 利用者IDごとに集計処理
    // TODO: 新聞・WEBの利用に応じて、料金を上乗せする cf) https://github.com/team-5g/mikiwame/pull/64#issuecomment-674336434
    _aggregateByID(rows) {
      const aggregation = {} // { [key:<利用者ID>], amount: 金額 }
      rows.forEach(row => {
        const [id/* 利用者ID */, /* 利用者名 */, /* 案件ID */, /* 調査種類 */, /* 案件区分 */, /* 案件名 */, /* 利用日 */, itemName/* 商品名 */, /* 件数 */, /* 単価 */, amountString/* 金額 */] = row
        if (id === '' || id === undefined) return

        if (aggregation[id] === undefined) aggregation[id] = 0

        // 検索料のみこちらの指定した金額に上乗せして請求する
        aggregation[id] += (itemName === '検索料')
          ? RISK_EYES_UNIT_PRICE
          : Number(amountString.slice(1)) // 先頭の円マークを除去
      })
      return aggregation
    },
    _saveAggregation(aggregation) {
      return getRiskEyesBillingRefByYYYYMM(this.selectedYYYYMM).set({
        ...aggregation,
        uploadedAt: new Date()
      })
    }
  }
}
</script>
