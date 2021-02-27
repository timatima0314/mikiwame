<template>
  <div>
    <el-dialog title="ユーザーの一括管理" :visible="isBulkModalOpen" :before-close="handleClose" style="text-align: left" :width="$mq === 'pc' ? '60%' : '80%'" @close="close">
      <div>
        ユーザーの情報を一括で編集できます。CSV形式のコマンドファイルをアップロードしてください。
      </div>
      <div style="font-weight: bold;">
        ソースファイルのアップロード
      </div>
      <input id="csv" type="file" @change="fileChange">
      <el-button icon="el-icon-plus" type="primary" :disabled="csv.length === 0" @click="upload">
        アップロード
      </el-button>
      <el-button icon="el-icon-download" type="primary" @click="downloadSampleCsv">
        サンプルCSVのダウンロード
      </el-button>
    </el-dialog>
    <add-talent-modal :is-modal-open.sync="uploaded" :is-bulk="true" :talents="talents" />
  </div>
</template>

<script>
import { convertCsvToArray } from '@/utils/convert_csv_to_array'
import addTalentModal from '@/components/AddTalentModal'
import { searchSiteFromOptions, searchCurrentJobFromOptions } from '@/utils/searchFromOptions'
import { getAddTalentBulkSampleCsv } from '@/constants/addTalentBulkSampleCsv'

/*
 * @use <add-target-modal :is-modal-open.sync="isModalOpen" :company-document-ref="companyDocumentRef" />
 */
export default {
  name: 'AddTalentBulkModal',
  components: { addTalentModal },
  props: {
    isBulkModalOpen: { type: Boolean, default: false }
  },
  data() {
    return {
      uploaded: false,
      csv: [],
      talents: []
    }
  },
  methods: {
    downloadSampleCsv() {
      let csv = '\ufeff' + '氏名,メールアドレス,国際コード,電話番号,会社名,候補者の現在の職種(大分類),候補者の現在の職種(小分類),応募媒体,企業担当者\n'
      const sampleItems = getAddTalentBulkSampleCsv()
      sampleItems.forEach(el => {
        var line = el['name'] + ',' + el['email'] + ',' + el['countryCode'] + ',' + el['phoneNumber'] + ',' + el['currentCompany'] + ',' + el['currentJobMajorCategory'] + ',' + el['currentJobMinorCategory'] + ',' + el['siteWhereTalentApplied'] + ',' + el['recruitmentOfficer'] + '\n'
        csv += line
      })
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'sample.csv'
      link.click()
    },
    fileChange(e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      // readAsBinaryStringでファイルを読み込んだ後に実行.
      reader.onload = e => {
        // csvファイルを連想配列に変換
        const talentArray = convertCsvToArray(e.target.result)
        // 連想配列の全要素をdataに格納
        Object.keys(talentArray).forEach(key => {
          const talentData = talentArray[key]
          this.csv.push({
            name: talentData['氏名'],
            email: talentData['メールアドレス'],
            countryCode: talentData['国際コード'],
            phoneNumber: talentData['電話番号'],
            currentCompany: talentData['会社名'],
            // csvのデータからfirestoreに格納用の連想配列の値(formの選択肢に形式を合わせる)を取得
            currentJobCategory: searchCurrentJobFromOptions(talentData['候補者の現在の職種(大分類)'], talentData['候補者の現在の職種(小分類)']),
            siteWhereTalentApplied: searchSiteFromOptions(talentData['応募媒体']),
            recruitmentOfficer: talentData['企業担当者']
          })
        })
      }
      reader.readAsArrayBuffer(file)
      this.talents = this.csv
    },
    upload() {
      this.uploaded = true
      this.close()
      this.csv = []
      document.getElementById('csv').value = ''
    },
    close() {
      this.$emit('update:isBulkModalOpen', false)
    },
    // ×ボタンかモーダルの外がクリックされた場合
    handleClose(done) {
      this.$confirm('候補者の追加を中断しますか?')
        .then(() => {
          done()
        })
        .catch(() => {})
    }
  }
}
</script>
