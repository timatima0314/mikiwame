<template>
  <div v-loading="loading" class="container">
    <el-row>
      <el-col :span="12"><h1>企業担当者一覧</h1></el-col>
      <el-col :offset="4" :span="6" style="margin-top: 1.3rem;">
        <el-button icon="el-icon-plus" type="primary" :disabled="isSubAccount" @click="isAddModalOpen = true">
          企業担当者追加
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="subAccounts">
      <el-table-column label="氏名" prop="name" />
      <el-table-column label="登録日時">
        <template slot-scope="{row}">
          {{ dayjs(row.createdAt.toDate()).format('YYYY/MM/DD') }}
        </template>
      </el-table-column>
      <el-table-column label="メールアドレス" prop="email" />
      <el-table-column label="部署" prop="department" />
      <el-table-column label="アカウントの有効切り替え" align="center">
        <template slot-scope="{row}">
          <el-switch :value="!row.bannedAt" :disabled="!row.uid || isSubAccount" @change="toggleAccountDisabled(row.id, row.uid, Boolean(row.bannedAt))" />
        </template>
      </el-table-column>
      <el-table-column label="ステータス" align="center">
        <template slot-scope="{row}">
          <span v-if="row.uid">パスワード設定済み</span>
          <span v-else>
            <el-button :disabled="isSubAccount" @click="sendMail(row.id)">メール再送</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="メニュー" align="center">
        <template slot-scope="{row}">
          <div style="margin-bottom: 8px">
            <el-button
              size="mini"
              type="success"
              :disabled="isSubAccount"
              @click="setEditing(row)"
            >
              編集
            </el-button>
          </div>
          <el-button
            size="mini"
            type="danger"
            :disabled="isSubAccount"
            @click="deleteSubAccount(row.id, row.uid)"
          >
            削除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-sub-account-modal :is-modal-open.sync="isEditModalOpen" :sub-account-data="selectedSubAccount" @unset-editing="unsetEditing" />
    <add-sub-account-modal :is-modal-open.sync="isAddModalOpen" />
  </div>
</template>

<script>
import { useCompany, updateSubAccount } from '@/utils/hooks/firestore'
import { mapGetters } from 'vuex'
import { functions, companiesCollectionRef } from '@/plugins/firebase'
import dayjs from 'dayjs'
import pick from 'lodash/pick'
import AddSubAccountModal from '@/components/subAccountModal/add'
import EditSubAccountModal from '@/components/subAccountModal/edit'

export default {
  name: 'CompanyAccounts',
  components: { AddSubAccountModal, EditSubAccountModal },
  data() {
    return {
      isAddModalOpen: false,
      isEditModalOpen: false,
      selectedSubAccount: {},
      loading: false,
      subAccounts: [],
      unsubscribe: () => {}
    }
  },
  computed: {
    ...mapGetters(['user', 'companyId', 'isSubAccount'])
  },
  async created() {
    this.loading = true
    const { companyDocumentSnapshot } = await useCompany({ companyId: this.companyId })
    const subAccountsQuery = companyDocumentSnapshot.ref.collection('subAccounts').orderBy('createdAt', 'asc')
    this.unsubscribe = subAccountsQuery.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        switch (change.type) {
          case 'added': // 初回取得時 or データ追加時
            this.subAccounts.unshift({ ...change.doc.data(), id: change.doc.id })
            break
          case 'modified':
            Object.assign(this.subAccounts.find(({ id }) => id === change.doc.id) || {}, change.doc.data())
            break
          case 'removed':
            this.subAccounts.splice(this.subAccounts.map(target => target.id).indexOf(change.doc.id), 1)
            break
        }
      })
    })
    this.loading = false
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    dayjs,
    setEditing(subAccount) {
      this.selectedSubAccount = pick(subAccount, ['id', 'name', 'email', 'department'])
      this.isEditModalOpen = true
    },
    unsetEditing() {
      this.selectedSubAccount = {}
      this.isEditModalOpen = false
    },
    sendMail(subAccountId) {
      this.loading = true
      functions.httpsCallable('notifySubAccountToSetPassword')({ companyId: this.companyId, subAccountId })
        .then(() => {
          this.$notify({
            title: 'Success',
            message: '企業担当者の追加に成功しました。パスワード設定メールを指定のメールアドレスに送信しました。',
            type: 'success'
          })
        })
        .catch(err => {
          this.$rollbar.error(err)
          this.$notify({
            type: 'error',
            title: 'Error',
            message: 'ネットワークエラーが発生しました。時間をおいて再度お試しください'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    toggleAccountDisabled(subAccountId, uid, isBanned) {
      // アカウントを既に無効にされている場合は有効に
      // 有効の場合は無効に
      this.loading = true
      const bannedAt = isBanned ? null : new Date()
      Promise.all([
        updateSubAccount({ companyId: this.companyId, subAccountId, data: { bannedAt }}),
        functions.httpsCallable('toggleAuthDisabled')({ disabledValue: !isBanned, subAccountUid: uid })
      ]).then(() => {
        this.$notify({ type: 'success', title: 'Success', message: `該当アカウントを${isBanned ? '有効' : '無効'}にしました。` })
        this.loading = false
      }).catch(err => {
        this.$rollbar.error(err)
        this.$notify({ type: 'error', title: 'Error', message: '処理に失敗しました。時間をおいて再度お試しください。' })
        this.loading = false
      })
    },
    async deleteSubAccount(id, uid) {
      await this.$confirm('このアカウントを完全に削除します。<br>よろしいですか？', {
        confirmButtonText: 'はい',
        cancelButtonText: 'いいえ',
        type: 'warning',
        dangerouslyUseHTMLString: true
      })
      this.loading = true
      try {
        if (uid) {
          await Promise.all([
            functions.httpsCallable('deleteFromSubAccountUids')({ companyId: this.companyId, uid }),
            functions.httpsCallable('toggleAuthDisabled')({ disabledValue: true, subAccountUid: uid })
          ])
        }
        await companiesCollectionRef.doc(this.companyId).collection('subAccounts').doc(id).delete()
        this.$notify({ type: 'success', title: 'Success', message: 'アカウントを完全に削除しました。' })
      } catch (err) {
        this.$rollbar.error(err)
        this.$notify({ type: 'error', title: 'Error', message: '処理に失敗しました。時間をおいて再度お試しください。' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.container
  width: 90%
  margin: auto
</style>
