<template>
  <div v-loading="loading" style="padding: 1rem">
    <h1>クライアント一覧</h1>
    <el-table
      :data="companies"
      :default-sort="{ prop: 'createdAt', order: 'descending' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="name" label="会社名" />
      <el-table-column prop="staffName" label="担当者氏名" />
      <el-table-column prop="address" label="住所" />
      <el-table-column prop="createdAt" label="登録日時" width="120px" />
      <el-table-column prop="email" label="メールアドレス" />
      <el-table-column prop="planText" label="プラン" />
      <el-table-column label="クレジットカード登録">
        <template v-slot="{ row }">
          <span v-if="getCreditCardValid(row)">有り</span>
          <span v-else>無し</span>
        </template>
      </el-table-column>
      <el-table-column prop="riskEyesId" label="RISK EYES 利用者ID" />
      <el-table-column label="メインアカウント（サブ含む）">
        <template v-slot="{ row }">
          <span v-if="row.subAccountUids">{{
            row.subAccountUids.length + 1
          }}</span>
          <span v-else>1</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template v-slot="{ row }">
          <div class="action-buttons-container">
            <el-button size="mini" @click="setEditing(row)">
              <i class="el-icon-edit" />
              <span>権限編集</span>
            </el-button>
            <el-button size="mini" @click="setNotifyTargetCompany(row)">
              <i class="el-icon-bell" />
              <span>通知再送</span>
            </el-button>
            <el-button
              v-if="!row.deletedAt"
              size="mini"
              type="danger"
              @click="forciblyWithdraw(row)"
            >
              <i class="el-icon-s-release" />
              <span style="padding: 0 17px">強制退会</span>
            </el-button>
            <el-button
              v-else
              size="mini"
              :type="row.bannedAt ? 'warning' : 'success'"
              @click="recoverAccount(row)"
            >
              <i class="el-icon-s-claim" />
              <span>アカウント復活</span>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 権限編集 -->
    <el-dialog
      :visible="Boolean(editingCompany.id)"
      :title="`${editingCompany.name}の編集`"
      @close="unsetEditing"
    >
      <el-form>
        <el-form-item label="アカウントの有効切り替え">
          <el-switch
            :value="Boolean(editingCompany.verifiedAt)"
            @change="onChangeVerification"
          />
        </el-form-item>
        <el-form-item label="プランの変更">
          <el-radio-group v-model="editingCompany.allowedPlan">
            <el-radio :label="PLANS.LIGHT">ライト</el-radio>
            <el-radio :label="PLANS.STANDARD">スタンダード</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="RISK EYES 利用者ID">
          <el-input
            v-model="editingCompany.riskEyesId"
            placeholder="利用者ID"
            prefix-icon="el-icon-unlock"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: center">
          <el-button
            type="info"
            @click="unsetEditing"
          >変更を破棄して閉じる</el-button>
          <el-button type="primary" @click="save">確定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 通知再送 -->
    <el-dialog
      :visible="Boolean(notifyTargetCompany.id)"
      :title="`${notifyTargetCompany.name}への通知`"
      @close="unsetNotifyTargetCompany"
    >
      <el-button
        :disabled="notifyTargetCompany.allowedPlan === PLANS.LIGHT"
        :loading="loading"
        @click="notifyCompanyEndPlanUpgrade(notifyTargetCompany.id)"
      >プランアップグレードの完了</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import pick from 'lodash/pick'
import { functions } from '@/plugins/firebase'
import { getCompanies, updateCompany } from '@/utils/hooks/firestore'
import { PLANS } from '@/utils/payment'
import { PLAN_STATUS_TO_TEXT, getPlanStatus } from '@/utils/plan_statuses'
import get from 'lodash/get'

const getDefaultEditingCompany = () => ({
  id: null,
  name: null,
  riskEyesId: null,
  verifiedAt: null,
  selectedPlan: PLANS.LIGHT,
  allowedPlan: PLANS.LIGHT
})

const getDefaultNotifyTargetCompany = () => ({
  id: null,
  name: null,
  allowedPlan: PLANS.LIGHT
})

export default {
  name: 'AdminIndex',
  data: () => ({
    loading: false,
    companies: [],
    editingCompany: getDefaultEditingCompany(),
    notifyTargetCompany: getDefaultNotifyTargetCompany,
    formerStateOfVerifiedAt: null
  }),
  computed: {
    ...mapGetters(['companyId']),
    PLANS: () => PLANS
  },
  created() {
    this.fetchCompanies().then(() => {
      // URLのqueryに?company=<companyId>がある場合は、それを設定対象にセットする。メールで該当クライアントの編集画面を送るため。
      const { company: companyId } = this.$route.query
      if (companyId === undefined) return // 運用会社(自分自身)は除外

      this.setEditing(
        this.companies.find((company) => company.id === companyId)
      )
    })
  },
  methods: {
    fetchCompanies() {
      return getCompanies().then((companies) => {
        this.companies = companies.flatMap((company) => {
          if (company.id === this.companyId) return []

          return {
            ...company,
            riskEyesId: company.riskEyesId || null, // 最初からプロパティに存在していないとObject.assignで変更検知できないため、定義しておく
            selectedPlan: company.selectedPlan || PLANS.LIGHT,
            allowedPlan: company.allowedPlan || PLANS.LIGHT,
            createdAt: dayjs(company.createdAt).format('YYYY/MM/DD'),
            planText:
              PLAN_STATUS_TO_TEXT[
                getPlanStatus({
                  selected: company.selectedPlan,
                  allowed: company.allowedPlan
                })
              ]
          }
        })
      })
    },
    setEditing(company) {
      this.editingCompany = {
        ...pick(company, [
          'id',
          'name',
          'riskEyesId',
          'verifiedAt',
          'selectedPlan',
          'allowedPlan'
        ]),
        verifiedAt: company.verifiedAt != null,
        wasLightPlan: company.allowedPlan === PLANS.LIGHT
      }

      // 編集画面を開いた時点でのアカウント有効か否かを保存
      this.formerStateOfVerifiedAt = this.editingCompany.verifiedAt
    },
    unsetEditing() {
      this.editingCompany = getDefaultEditingCompany()
      this.$router.replace({ query: null })
      this.formerStateOfVerifiedAt = null
    },
    setNotifyTargetCompany(company) {
      this.notifyTargetCompany = {
        ...pick(company, ['id', 'name', 'allowedPlan'])
      }
    },
    unsetNotifyTargetCompany() {
      this.notifyTargetCompany = getDefaultNotifyTargetCompany()
    },
    onChangeVerification(willVerify) {
      this.editingCompany.verifiedAt = willVerify ? new Date() : null
    },
    async save() {
      try {
        const updateData = pick(this.editingCompany, [
          'riskEyesId',
          'verifiedAt',
          'allowedPlan'
        ])
        const targetCompanyId = this.editingCompany.id
        const { wasLightPlan, allowedPlan } = this.editingCompany // モーダルを閉じるためにeditingCompanyをunsetする。その前に値を取り出しておく
        await updateCompany({
          companyId: this.editingCompany.id,
          data: updateData
        })
        Object.assign(
          this.companies.find((company) => company.id === targetCompanyId) ||
            {},
          {
            ...updateData,
            planText:
              PLAN_STATUS_TO_TEXT[
                getPlanStatus({
                  selected: this.editingCompany.selectedPlan,
                  allowed: this.editingCompany.allowedPlan
                })
              ]
          }
        )

        // 無効だったアカウントを有効に切り替えて確定した場合，クライアントにアカウントが有効になったことをメールで通知
        if (!this.formerStateOfVerifiedAt && this.editingCompany.verifiedAt) { this.notifyCompanyAvailable(targetCompanyId) }

        this.unsetEditing() // ここでモーダルが閉じられる
        this.$notify({
          type: 'success',
          title: 'Success',
          message: '権限編集に成功しました'
        })
        if (!wasLightPlan || allowedPlan !== PLANS.STANDARD) return

        const title = 'スタンダードプランのアップグレード完了通知'
        const body =
          'このユーザーはスタンダードプランの利用が可能になります。アップグレードの完了をメールで通知しますか？'
        const confirm = await this.$confirm(body, title).catch(() => {})
        if (confirm) await this.notifyCompanyEndPlanUpgrade(targetCompanyId)
      } catch (err) {
        this.$rollbar.error(err)
        this.$notify({
          type: 'error',
          title: 'Error',
          message:
            '権限編集に失敗しました。通信環境を確認したうえで再度お試しください。'
        })
      }
    },
    notifyCompanyEndPlanUpgrade(targetCompanyId) {
      this.loading = true
      return functions
        .httpsCallable('notifyCompanyEndPlanUpgrade')({
          companyId: targetCompanyId
        })
        .then(() => {
          this.$notify({
            type: 'success',
            title: 'Success',
            message: 'アップグレード完了通知に成功しました'
          })
        })
        .catch((err) => {
          this.$rollbar.error(err)
          this.$notify({
            type: 'error',
            title: 'Error',
            message:
              'アップグレード完了通知に失敗しました。通信環境を確認したうえで再度お試しください。'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    notifyCompanyAvailable(targetCompanyId) {
      this.loading = true
      return functions
        .httpsCallable('notifyCompanyAvailable')({ companyId: targetCompanyId })
        .then(() => {
          this.$notify({
            type: 'success',
            title: 'Success',
            message: 'アカウント有効化通知に成功しました'
          })
        })
        .catch((err) => {
          this.$rollbar.error(err)
          this.$notify({
            type: 'error',
            title: 'Error',
            message:
              'アカウント有効化通知に失敗しました。通信環境を確認したうえで再度お試しください。'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    async forciblyWithdraw(targetCompany) {
      const confirm = await this.$confirm(
        `${targetCompany.name}を強制的に退会させます。本当によろしいですか？`
      ).catch(() => {})
      if (confirm === undefined) return

      this.loading = true
      await updateCompany({
        companyId: targetCompany.id,
        data: { deletedAt: new Date(), bannedAt: new Date() }
      })
      return functions
        .httpsCallable('toggleAuthDisabled')({
          disabledValue: true,
          companyId: targetCompany.id
        })
        .then(() => {
          this.$notify({
            type: 'success',
            title: 'Success',
            message: '退会処理が完了しました。'
          })
          this.fetchCompanies()
        })
        .catch((err) => {
          this.$rollbar.error(err)
          this.$notify({
            type: 'error',
            title: 'Error',
            message:
              '退会処理に失敗しました。通信環境を確認したうえで再度お試しください。'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    async recoverAccount(targetCompany) {
      if (targetCompany.bannedAt) {
        const confirm = await this.$confirm(
          `${targetCompany.name}のアカウントを復活させます。本当によろしいですか？`,
          '強制退会済みのアカウントです',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'キャンセル',
            type: 'warning',
            center: true
          }
        ).catch(() => {})
        if (confirm === undefined) return
      } else {
        const confirm = await this.$confirm(
          `${targetCompany.name}のアカウントを復活させます。本当によろしいですか？`
        ).catch(() => {})
        if (confirm === undefined) return
      }

      this.loading = true
      await updateCompany({
        companyId: targetCompany.id,
        data: { deletedAt: null, bannedAt: null }
      })
      return functions
        .httpsCallable('toggleAuthDisabled')({
          disabledValue: false,
          companyId: targetCompany.id
        })
        .then(() => {
          this.$notify({
            type: 'success',
            title: 'Success',
            message: 'アカウント復活処理が完了しました。'
          })
          this.fetchCompanies()
        })
        .catch((err) => {
          this.$rollbar.error(err)
          this.$notify({
            type: 'error',
            title: 'Error',
            message:
              'アカウント復活処理に失敗しました。通信環境を確認したうえで再度お試しください。'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    getCreditCardValid(company) {
      return get(company, 'creditCard.valid')
    },
    // tabelのrowのclassを指定
    tableRowClassName({ row, rowIndex }) {
      if (!row.verifiedAt) {
        return 'verifiedAt-null-row'
      } else if (rowIndex % 2 === 0) {
        return 'stripe-gray-row'
      }
      return ''
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .el-table
.verifiedAt-null-row
  background: #fde2e2
  .stripe-gray-row
    background: #fafafa
.action-buttons-container
  .el-button
    display: block
    margin-left: 0
    &:nth-of-type(n + 2) // 2番目以降にスタイルを当てる
      margin-top: 8px
</style>
