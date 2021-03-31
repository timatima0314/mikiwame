<template>
  <el-container
    v-loading.fullscreen.lock="fullScreenLoading"
    class="dashboard-container"
  >
    <el-header style="height: 300px">
      <TalentDataGraph
        :talents="talentsUndeleted"
        @filteredTalentsListener="filteredTalentsListener"
      />
    </el-header>
    <el-container style="height: 50vw">
      <el-dialog
        :visible="urlDialogFlag"
        :show-close="false"
        width="30%"
        center
      >
        <div style="text-align: center">
          <h3>
            以下のテキストをコピーしました。<br>
            {{
              selectedTalentData.name
            }}さんに伝えて推薦者登録を依頼してください
          </h3>
        </div>
        <div style="background-color: #e5e5ed; padding: 0.8em">
          {{ linkToTalentPage }}
        </div>
        <div style="text-align: right; margin-top: 1rem">
          <el-button
            type="primary"
            @click="urlDialogFlag = false"
          >OK</el-button>
        </div>
      </el-dialog>
      <el-aside width="350px">
        <div style="display: flex; margin-bottom: 1em">
          <el-button
            icon="el-icon-plus"
            type="info"
            @click="isModalOpen = true"
          >
            候補者追加
          </el-button>
          <el-button
            icon="el-icon-plus"
            type="info"
            @click="isBulkModalOpen = true"
          >
            候補者の一括追加
          </el-button>
        </div>
        <el-input
          v-model="searchText"
          size="mini"
          placeholder="検索"
          suffix-icon="el-icon-search"
          class="search-input"
          style="margin-bottom: 4px"
        />
        <div v-for="(target, idx) in stringSearchedTalents" :key="idx">
          <el-divider class="menu-divider" />
          <el-button class="card-button" @click="selectTalent(target)">
            <el-card
              class="card-referees"
              :body-style="changeSelectedButtonColor(target.id)"
              shadow="never"
            >
              <el-button
                type="text"
                style="display: none"
                class="delete-talent-button"
                @click="deleteTalent(target)"
              >×</el-button>
              <div class="card-header">
                <el-tag
                  :type="isOverdue(target.deadline) ? 'danger' : 'info'"
                  size="mini"
                  :effect="isOverdue(target.deadline) ? 'dark' : 'plain'"
                >
                  期日
                </el-tag>
                {{
                  target.deadline
                    ? dayjs(target.deadline.toDate()).format("YYYY/MM/DD")
                    : ""
                }}
                <span
                  class="card-status"
                  :style="get(statusProperty[target.status], 'style')"
                >
                  {{ get(statusProperty[target.status], "text") }}
                </span>
              </div>
              <div class="card-name">{{ target.name }}</div>
            </el-card>
          </el-button>
        </div>
      </el-aside>

      <el-container>
        <el-main>
          <div v-if="isEmpty(selectedTalentData)">
            <div class="not-selected-card" style="position: initial">
              <div class="not-selected-text">
                候補者が選択されていません。候補者を選択するか、候補者を追加してください。
              </div>
              <el-button
                icon="el-icon-plus"
                type="info"
                @click="isModalOpen = true"
              >
                候補者追加
              </el-button>
              <el-button
                icon="el-icon-plus"
                type="info"
                @click="isBulkModalOpen = true"
              >
                候補者の一括追加
              </el-button>
            </div>
            <guide-grid />
          </div>
          <div v-else style="margin: 0 10px">
            <el-card style="margin: 10px 0">
              <div class="referee-job-category">
                {{
                  getJobCategoryLabel(
                    selectedTalentData.currentJobCategory || []
                  )
                }}
              </div>
              <div class="referee-name">{{ selectedTalentData.name }}</div>
              <div class="referee-current-company">
                現在のお勤め先: {{ selectedTalentData.currentCompany }}
              </div>
              <div class="referee-email">{{ selectedTalentData.email }}</div>
              <div class="referee-recruitmentOfficer">
                企業担当者: {{ selectedTalentData.recruitmentOfficer }}
              </div>

              <div class="referee-buttons">
                <el-button
                  type="success"
                  icon="el-icon-edit"
                  @click="isUpdateModalOpen = true"
                >編集する</el-button>
                <el-button
                  type="secondary"
                  icon="el-icon-message"
                  @click="onClickSendEmail(selectedTalentData)"
                >メール送信</el-button>

                <el-button
                  v-clipboard:copy="linkToTalentPage"
                  icon="el-icon-copy-document"
                  type="primary"
                  @click="urlDialogFlag = true"
                >URLコピー</el-button>
                <el-button
                  type="info"
                  icon="el-icon-s-order"
                  @click="
                    $router.push(
                      `/company/talents/${selectedTalentData.id}/report`
                    )
                  "
                >レポート</el-button>
              </div>
            </el-card>

            <el-tabs>
              <el-tab-pane label="推薦者情報">
                <referee-list
                  :referee-breakdowns="selectedTalentData.refereeBreakdown"
                  :referees="referees"
                  :loading="refereeLoading"
                />
              </el-tab-pane>
              <el-tab-pane label="ステータス">
                <status
                  :talent-data="selectedTalentData"
                  :loading="refereeLoading"
                />
              </el-tab-pane>
              <el-tab-pane label="反社チェック" :disabled="isLightPlan">
                <risk-check
                  :talent-data="selectedTalentData"
                  :risk-eyes-id="riskEyesId"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <add-talent-modal :is-modal-open.sync="isModalOpen" />
    <add-talent-bulk-modal :is-bulk-modal-open.sync="isBulkModalOpen" />
    <talent-edit
      :is-update-modal-open.sync="isUpdateModalOpen"
      :talent-data="selectedTalentData"
      :referees="referees"
    />
  </el-container>
</template>

<script>
import dayjs from 'dayjs'
import defaultTo from 'lodash/defaultTo'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { mapGetters } from 'vuex'
import { functions, companiesStorageRef } from '@/plugins/firebase'
import { useCompany, getReferees, updateTalent } from '@/utils/hooks/firestore'
import { getJobCategoryOptionsByLang } from '@/constants/options'
import { statusProperty } from '@/constants/status'
import AddTalentModal from '@/components/AddTalentModal'
import AddTalentBulkModal from '@/components/AddTalentBulkModal'
import GuideGrid from '@/components/GuideGrid'
import TalentEdit from '@/components/TalentEdit'
import TalentDataGraph from '@/components/TalentDataGraph'
import RiskCheck from '@/components/TalentDetailMenu/risk_check'
import Status from '@/components/TalentDetailMenu/status'
import RefereeList from '@/components/TalentDetailMenu/referee_list'
import { PLAN_STATUSES } from '@/utils/plan_statuses'
import { getI18n } from '@/constants/i18n'

export default {
  name: 'Dashboard',
  components: {
    AddTalentModal,
    AddTalentBulkModal,
    GuideGrid,
    TalentEdit,
    RiskCheck,
    Status,
    RefereeList,
    TalentDataGraph
  },
  data() {
    return {
      statusProperty,
      isModalOpen: false,
      isBulkModalOpen: false,
      isUpdateModalOpen: false,
      searchText: '',
      listLoading: false,
      refereeLoading: false,
      fullScreenLoading: false,
      riskEyesId: '',
      talents: [],
      filteredTalents: [],
      selectedTalentData: {},
      referees: [{ name: '', email: '', belongs: '' }],
      unsubscribe: () => {},
      urlDialogFlag: false
    }
  },
  computed: {
    ...mapGetters(['user', 'isAdmin', 'companyId', 'planStatus']),
    talentsUndeleted() {
      return this.talents.filter((talent) => !talent.deletedAt)
    },
    // 文字列検索した候補者群
    stringSearchedTalents() {
      return this.searchText
        ? this.filteredTalents.filter((target) =>
          JSON.stringify(Object.values(target)).includes(this.searchText)
        )
        : this.filteredTalents
    },
    isLightPlan() {
      return this.planStatus !== PLAN_STATUSES.STANDARD
    },
    talentI18n() {
      const i18n = getI18n('talent')
      if (this.selectedTalentData.language) {
        i18n.locale = this.selectedTalentData.language
      } else i18n.locale = 'jp'
      return i18n
    },
    linkToTalentPage() {
      const text = this.talentI18n.t('message.messageAndURLForTalent')
      return `${text} ${location.origin}/talent/instruction?company=${this.companyId}&token=${this.selectedTalentData.id}`
    }
  },
  async created() {
    this.listLoading = true
    const { companyDocumentSnapshot, companyData } = await useCompany({
      companyId: this.companyId
    })
    this.riskEyesId = companyData.riskEyesId
    // 最終更新日が新しい順に表示したいのに、ascで並び替えている理由
    // 1. 新しくデータが追加された際、unshiftで先頭に追加したい。
    // 2. 初回読み込み時もデータ追加時もchange.typeはaddedになる。つまり区別がつかない
    // cf) https://firebase.google.com/docs/firestore/query-data/listen?hl=ja#view_changes_between_snapshots
    // 3. 初回読み込み時もデータ追加時と同じようにunshiftする都合上、descではなくascで並び替える
    const talentsQuery = companyDocumentSnapshot.ref
      .collection('talents')
      .orderBy('createdAt', 'asc')
    this.unsubscribe = talentsQuery.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        switch (change.type) {
          case 'added': // 初回取得時 or データ追加時
            this.talents.unshift({
              deletedAt: null,
              ...change.doc.data(),
              id: change.doc.id
            })
            break
          case 'modified':
            Object.assign(
              this.talents.find(({ id }) => id === change.doc.id) || {},
              change.doc.data()
            )
            break
          case 'removed':
            this.talents.splice(
              this.talents.map((target) => target.id).indexOf(change.doc.id),
              1
            )
            break
        }
      })
    })
    this.listLoading = false
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    defaultTo,
    get,
    isEmpty,
    dayjs,
    toggleLoading() {
      this.fullScreenLoading = !this.fullScreenLoading
    },
    async fetchReferees(talentId) {
      this.refereeLoading = true
      try {
        const referees = await getReferees({
          companyId: this.companyId,
          talentId: talentId
        })
        this.referees = await Promise.all(
          referees.map(async(referee) => {
            const refereesRef = companiesStorageRef.child(
              `${this.companyId}/talents/${talentId}/referees/${referee.id}`
            )
            const businessCardUrl = await refereesRef
              .getDownloadURL()
              .catch(() => {})
            return { ...referee, businessCardUrl }
          })
        )
      } finally {
        this.refereeLoading = false
      }
    },
    onClickSendEmail(talentRowData) {
      const { id: talentId } = talentRowData
      this.toggleLoading()
      // https://github.com/team-5g/mikiwame/issues/276
      // sendgrid の送信完了を待つと、3秒以上ローディングで待たされてしまう。そのため、完了を待たずに成功通知を出してしまう。
      functions.httpsCallable('sendMailToTalentByIds')({
        companyId: this.companyId,
        talentId
      })
      // .catch(() => { this.$notify({ title: 'Error', message: 'メールの送信に失敗しました。通信環境を確認したうえで再度お試しください。', type: 'error' })
      this.$notify({
        title: 'Success',
        message: 'メールの送信に成功しました',
        type: 'success'
      })
      // 候補者のステータスを「未送信」から「未開封」へ変更
      updateTalent({
        companyId: this.companyId,
        talentId: this.selectedTalentData.id,
        data: { status: statusProperty.mailSend.key }
      })
      this.toggleLoading()
    },
    selectTalent(talentData) {
      this.selectedTalentData = talentData
      this.fetchReferees(talentData.id)
    },
    getJobCategoryLabel([parentValue, childValue]) {
      if (parentValue !== undefined && childValue !== undefined) {
        const parentJobCategory = getJobCategoryOptionsByLang().find(
          (elem) => elem.value === parentValue
        )
        const childJobCategory = parentJobCategory.children.find(
          (elem) => elem.value === childValue
        )
        return `${parentJobCategory.label} ${childJobCategory.label}`
      }
    },
    changeSelectedButtonColor(id) {
      // TODO: 削除ボタン復活したらpadding-topを0にする(UNO)
      if (id === this.selectedTalentData.id) {
        return { 'background-color': '#e5e5ed', 'padding-top': '10' }
      }
      return { 'padding-top': '10' }
    },
    isOverdue(deadline) {
      if (deadline == null) return false

      return dayjs().isAfter(deadline.toDate())
    },
    // TlentDataGraphからfilteredTalents(絞り込み後の候補者群)を取得
    filteredTalentsListener(value) {
      this.filteredTalents = value
    },
    async deleteTalent(talentData) {
      this.$confirm(talentData.name + 'さんを削除しますか？', '候補者の削除', {
        confirmButtonText: ''
      }).then(() => {
        this.toggleLoading()
        return updateTalent({
          companyId: this.companyId,
          talentId: talentData.id,
          data: { deletedAt: new Date() }
        })
          .then(() => {
            this.$message({
              message: '削除に成功しました',
              type: 'success'
            })
            this.selectedTalentData = {}
          })
          .catch((err) => {
            this.$rollbar.error(err)
            this.$message({
              message:
                '削除に失敗しました。通信環境を確認したうえで再度お試しください。',
              type: 'error'
            })
          })
          .finally(this.toggleLoading)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.dashboard {
  &-container {
    margin: 30px;
    .report-button {
      display: inline-block;
    }
    .el-button--mini {
      padding: 3px 7px !important;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.el-icon-s-data {
  margin-top: 15px;
  color: #827af3;
  font-size: 40px;
}
.talent-number {
  font-size: 40px;
  text-align: center;
  font-weight: bold;
}
.profile-image {
  width: 32px;
  height: 32px;
  border-radius: 5px;
}
.el-card {
  border-radius: 0;
}
.card {
  &-referees {
    border-style: none;
    &:hover {
      background-color: #e5e5ed;
    }
  }
  &-header {
    font-size: 12px;
    text-align: left;
    margin-bottom: 10px;
    color: #606266;
  }
  &-name {
    font-weight: bold;
    font-size: 18px;
  }
  &-status {
    float: right;
    font-weight: 600;
    padding: 4px;
    border-radius: 4px;
    color: #fff;
  }
  &-button {
    margin: 0;
    padding: 0;
    width: 350px;
    border-style: none;
    text-align: left;
    font-family: inherit;
    outline: none;
  }
}
.referee {
  &-name {
    font-size: 35px;
    font-weight: bold;
  }
  &-current-company {
    margin-top: 10px;
    color: #606266;
  }
  &-email,
  &-job-category,
  &-recruitmentOfficer {
    color: #606266;
  }
  &-buttons {
    margin-top: 10px;
  }
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  height: 100%;
  margin: 0 auto;
}
.not-selected {
  &-text {
    margin: 10px 0 20px 0;
    color: #606266;
    font-size: 80%;
  }
  &-card {
    position: absolute;
    text-align: center;
    border: 1px dashed #909399;
    padding: 15px 8px;
    background-color: #e5e5ed;
  }
}
.menu-divider {
  margin: 0;
}
.delete-talent-button {
  padding-bottom: 3px;
  padding-top: 5px;
  padding-left: 90%;
}
</style>
