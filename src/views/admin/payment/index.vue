<template>
  <div v-loading="loading" style="padding: 1rem">
    <h1>RISK EYES 利用状況CSVアップロード</h1>
    <UploadRiskEyesCSV :loading.sync="loading" @upload-end="setClaimTargetCompanies" />
    <h1>都度課金CSV出力</h1>
    <h2>注意事項</h2>
    <ul>
      <li>出力したCSVファイルは、GMOのショップ管理画面からアップロードしてください</li>
      <li>出力されたCSVの空白列は削除しないでください</li>
      <li>GMO管理画面にて、「ファイルモード」は「会員ID指定」を選択してください</li>
    </ul>

    <el-card>
      <div slot="header" style="display: flex; align-items: center">
        <span>都度課金CSV({{ lastMonth }}月利用分)</span>
        <div style="margin-left: auto">
          <el-button @click="downloadEachTimeCredit"><i class="el-icon-download" />CSVダウンロード</el-button>
          <a :href="`https://${baseURL}/credit/batch/`" target="_blank">
            <el-button>
              アップロード先(GMOショップ管理画面)<i class="el-icon-top-right" />
            </el-button>
          </a>
        </div>
      </div>
      <el-table :data="recurringCredit.slice(0, 20)">
        <el-table-column prop="amount" label="利用金額" />
        <el-table-column prop="memberID" label="会員ID" />
        <el-table-column prop="detail" label="加盟店自由項目" />
      </el-table>
      <small style="float: right; margin: 1rem">20件に絞って表示しています。すべて見るにはCSVをダウンロードしてください</small>
    </el-card>

    <!-- 都度課金を用いるため、一旦隠す
      <el-card>
      <div slot="header" style="display: flex; align-items: center">
        <span>洗替依頼CSV</span>
        <div style="margin-left: auto">
          <el-button @click="downloadAraigae"><i class="el-icon-download" />CSVダウンロード</el-button>
          <a :href="`https://${baseURL}/creditcontinuance/ak2arai/`" target="_blank">
            <el-button>
              アップロード先(GMOショップ管理画面)<i class="el-icon-top-right" />
            </el-button>
          </a>
        </div>
      </div>
      <el-table :data="araigae.slice(0, 20)">
        <el-table-column prop="memberID" label="会員ID" />
        <el-table-column prop="detail" label="加盟店自由項目" />
      </el-table>
    </el-card>

    <div style="height: 2rem" />

    <el-card>
      <div slot="header" style="display: flex; align-items: center">
        <span>継続課金CSV({{ lastMonth }}月利用分)</span>
        <div style="margin-left: auto">
          <el-button @click="downloadRecurringCredit"><i class="el-icon-download" />CSVダウンロード</el-button>
          <a :href="`https://${baseURL}/creditcontinuance/ak2uri/`" target="_blank">
            <el-button>
              アップロード先(GMOショップ管理画面)<i class="el-icon-top-right" />
            </el-button>
          </a>
        </div>
      </div>
      <el-table :data="recurringCredit.slice(0, 20)">
        <el-table-column prop="shopID" label="ショップID" />
        <el-table-column prop="memberID" label="会員ID" />
        <el-table-column prop="date" label="利用年月日" />
        <el-table-column prop="amount" label="利用金額" />
        <el-table-column prop="detail" label="加盟店自由項目" />
      </el-table>
    </el-card>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Papa from 'papaparse'
import Encoding from 'encoding-japanese'
import dayjs from 'dayjs'
import { calcDayDiff } from '@/utils/date'
import get from 'lodash/get'
import { adminConfigsRef, getRiskEyesBillingRefByYYYYMM } from '@/plugins/firebase'
import { getCompanies } from '@/utils/hooks/firestore'
import UploadRiskEyesCSV from '../_components/UploadRiskEyesCSV'
import { PLANS, calcMonthlyPayment } from '@/utils/payment'

export default {
  name: 'Payment',
  components: { UploadRiskEyesCSV },
  data: () => ({
    loading: true,
    companies: [],
    shopID: ''
  }),
  computed: {
    ...mapGetters(['companyId']),
    baseURL() {
      const url = process.env.VUE_APP_PAYMENT_PAGE_BASE_URL
      return url.endsWith('/') ? url.slice(0, url.length - 1) : url
    },
    lastMonth() {
      return dayjs().add(-1, 'month').get('month') + 1
    },
    // クレジットカードが有効な会社たち
    validCreditCompanies() {
      return this.companies.filter(company => get(company, 'creditCard.valid'))
    },
    // CSVを吐き出す処理たち cf) B21_管理画面操作マニュアル_洗替・継続課金.pdf
    // 洗替用のCSVデータを表す DEPRECATED
    araigae() {
      return this.validCreditCompanies.map(company => ({
        memberID: company.id,
        cardSeq: '', // デフォルトで設定されたカードを使うので空欄
        detail: company.name.slice(0, 25) // max 50byteのため、日本語25文字まで。こちらが自由に設定できる。返却されるCSVに乗る。会社名を入れることでわかりやすくする。
      }))
    },
    // 継続課金のCSVデータを表す DEPRECATED
    recurringCredit() {
      return this.validCreditCompanies.map((company, index) => ({
        shopID: this.shopID,
        memberID: company.id,
        cardSeq: '',
        transactionCode: 0, // 0: 売上, 1: キャンセル
        date: dayjs().add(-1, 'month').endOf('month').format('YYYYMMDD'), // クレカの利用明細に表示される日付。先月の末日を指定
        orderID: `${dayjs().unix()}${company.id}`.slice(0, 27), // max 27byte. 日時を用いてユニークになるようにする。unixtime + companyID
        itemCode: '',
        amount: company.amount, // 利用金額 TODO: 従量課金APIの使用回数に応じて計算
        tax: '', // 利用金額に含めるので省略
        paymentMethod: 1, // 継続課金の場合は1: 一括払い固定
        reserve1: '', // 予備
        reserve2: '', // 予備
        reserve3: '', // 予備
        terminalSeq: index + 1, // 端末処理通番。1~99999。CSVファイル内で一意にする必要がある。cf) https://faq.gmo-pg.com/service/Detail.aspx?id=1067
        detail: company.name.slice(0, 25), // max 50byteのため、日本語25文字まで。こちらが自由に設定できる。返却されるCSVに乗る。会社名を入れることでわかりやすくする。
        procNo: '', // 処理番号
        procResult: '', // 処理結果
        targetCode: '', // 仕向先コード
        authResult: '' // オーソリ結果
      }))
    },
    // 都度決済のCSVデータを表す
    eachTimeCredit() {
      return this.validCreditCompanies.map((company, index) => ({
        shopID: this.shopID, // ショップID
        orderID: `${dayjs().unix()}${company.id}`.slice(0, 27), // オーダーID。max 27byte. 日時を用いてユニークになるようにする。unixtime + companyID
        processDivision: 'CAPTURE', // 処理区分。 CAPTURE は即時売上であり、仮売上(カード与信枠確保)と実売上 (売上確定)の処理を同時に実施する
        itemCode: '', // 商品コード。通常は省略
        amount: company.amount, // 利用金額
        tax: '', // 税送料。利用金額に含めるので省略
        paymentMethod: 1, // 支払い方法。1: 一括払い
        paymentCount: '', // 支払回数。
        cardType: '', // カード種別
        memberID: company.id, // 会員ID
        cardSeq: '', // 登録連番。登録されたカードのうち、どれを使うか。省略したらデフォルトのカードを用いる。
        reserve: '', // 予備項目
        detail: company.name.slice(0, 50), // 加盟店自由項目1。max 100byteのため、日本語50文字まで。こちらが自由に設定できる。返却されるCSVに乗る。会社名を入れることでわかりやすくする。
        // 以下、何も書かないが、アップロード形式上必要なもの
        freeColumn2: '', // 加盟店自由項目2
        freeColumn3: '', // 加盟店自由項目3
        tradeID: '', // 取引ID
        tradePassword: '', // 取引パスワード
        transactionID: '', // トランザクションID
        verificationNumber: '', // 承認番号
        targetCode: '', // 仕向先コード
        errorCode: '', // エラーコード
        errorDetailCode: '', // エラー詳細コード
        processedAt: '' // 処理日時
      }))
    }
  },
  created() {
    this.loading = true
    this.setClaimTargetCompanies().finally(() => { this.loading = false })
  },
  methods: {
    // 請求対象である各会社について、月額利用料(amount)をセットする
    async setClaimTargetCompanies() {
      const adminConfigSnapshot = await adminConfigsRef.get()
      this.shopID = adminConfigSnapshot.data().shopID
      const companiesData = await getCompanies()
      const lastMonthRiskEyesBillingsSnapshot = await getRiskEyesBillingRefByYYYYMM(dayjs().add(-1, 'month').format('YYYYMM')).get()
      this.companies = companiesData.flatMap(company => {
        if (company.id === this.companyId) return [] // 運用会社(自分自身)は除外
        if (!company.verifiedAt) return [] // そもそも有効化してないアカウントは請求対象にしない
        if (company.allowedPlan !== PLANS.STANDARD) {
          if (company.deletedAt && calcDayDiff(company.deletedAt, company.verifiedAt) <= 10) return [] // ライトプランかつ承認日時が退会時刻から10日以内なら除外
          if (company.bannedAt && calcDayDiff(company.bannedAt, company.verifiedAt) <= 10) return [] // ライトプランかつ承認日時が強制退会時刻から10日以内なら除外
          if (calcDayDiff(new Date(), company.verifiedAt) <= 10) return [] // ライトプランかつ承認日時が現在時刻から10日以内なら除外
        }

        const thresholdDate = dayjs().add(-1, 'month').startOf('month') // 先月の1日。 これより前に退会 or 強制退会した会社は請求対象にしない
        if (company.bannedAt && dayjs(company.bannedAt).isBefore(thresholdDate)) return []
        if (company.deletedAt && dayjs(company.deletedAt).isBefore(thresholdDate)) return []

        const lastMonthRiskEyesBilling = lastMonthRiskEyesBillingsSnapshot.exists
          ? lastMonthRiskEyesBillingsSnapshot.data()[company.riskEyesId] || 0
          : 0
        return {
          ...company,
          amount: calcMonthlyPayment({
            plan: company.allowedPlan,
            // サブアカウントの数 + 本アカウント1つ の合計
            subAccountCount: company.subAccountUids ? company.subAccountUids.length + 1 : 1,
            otherBilling: lastMonthRiskEyesBilling
          })
        }
      })
    },
    downloadAraigae() {
      this.downloadCSV(this.araigae, 'araigae')
    },
    downloadRecurringCredit() {
      this.downloadCSV(this.recurringCredit, 'keizokukakin')
    },
    downloadEachTimeCredit() {
      this.downloadCSV(this.eachTimeCredit, 'tsudokakin')
    },
    downloadCSV(data, filenamePrefix) {
      const csv = Papa.unparse(data, { header: false, quotes: true })
      // shiftJISに変換 cf) https://qiita.com/fumihiko-hidaka/items/1fb8933072db76214079
      const unicodeList = []
      for (const word of csv) {
        unicodeList.push(word.charCodeAt(0))
      }
      const shiftJisCodeList = Encoding.convert(unicodeList, 'sjis', 'unicode')
      const uInt8List = new Uint8Array(shiftJisCodeList)
      const blob = new Blob([uInt8List], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `${filenamePrefix}-${dayjs().format('YYYYMMDD')}.csv`
      link.click()
    }
  }
}
</script>
