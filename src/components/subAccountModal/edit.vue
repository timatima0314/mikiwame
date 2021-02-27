<template>
  <el-dialog title="企業担当者の編集" :visible="isModalOpen" :before-close="handleClose" style="text-align: center" :width="$mq === 'pc' ? '60%' : '80%'" @close="close">
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      :disabled="loading"
      :label-position="$mq === 'pc' ? 'right' : 'top'"
      :label-width="$mq === 'pc' ? '10rem' : '20rem'"
      :style="$mq === 'pc' ? '' : 'text-align: left'"
    >

      <el-form-item label="氏名" prop="name">
        <el-input v-model="form.name" placeholder="山田太郎" />
      </el-form-item>

      <el-form-item label="メールアドレス" prop="email">
        <el-input v-model="form.email" placeholder="info@mikiwame-p.jp" />
      </el-form-item>

      <el-form-item label="部署名" prop="department">
        <el-input v-model="form.department" placeholder="人事部" />
      </el-form-item>

      <el-button type="primary" @click="updateSubAccount">送信する</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateSubAccount } from '@/utils/hooks/firestore'
import { companiesCollectionRef } from '@/plugins/firebase'

const getDefaultFormValues = () => ({
  name: '',
  email: '',
  department: ''
})

export default {
  name: 'EditSubAccountModal',
  props: {
    isModalOpen: { type: Boolean, default: false },
    subAccountData: {
      type: Object,
      default: () => ({
        name: '',
        email: '',
        id: '',
        department: ''
      })
    }
  },
  data() {
    return {
      loading: false,
      form: getDefaultFormValues()
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    rules: () => ({
      name: [{ required: true, message: '氏名を入力してください', trigger: 'blur' }],
      email: [
        { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
        { type: 'email', message: 'メールアドレスの形式が無効です', trigger: 'blur' }
      ],
      department: [{ required: true, message: '部署名を入力してください', trigger: 'blur' }]
    })
  },
  watch: {
    isModalOpen() {
      this.assignDataToForm()
    }
  },
  methods: {
    assignDataToForm() {
      this.form = this.subAccountData
    },
    toggleLoading() {
      this.loading = !this.loading
    },
    close() {
      this.$emit('unset-editing')
    },
    // ×ボタンかモーダルの外がクリックされた場合
    handleClose(done) {
      this.$confirm('企業担当者の編集を中断しますか?')
        .then(() => {
          done()
        })
        .catch(() => {})
    },
    async updateSubAccount() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) return

      this.toggleLoading()
      const snap = await companiesCollectionRef.doc(this.companyId).collection('subAccounts').where('email', '==', this.form.email).get()
      if (!snap.empty) {
        this.$notify({
          type: 'error',
          title: 'Error',
          message: 'ご入力されたメールアドレスは既に使用されております。他のメールアドレスをご入力ください。'
        })
        this.toggleLoading()
        return
      }
      updateSubAccount({ companyId: this.companyId, subAccountId: this.subAccountData.id, data: this.form })
        .then(() => {
          this.$notify({
            title: 'Success',
            message: '企業担当者の情報を編集しました。',
            type: 'success'
          })
          this.form = getDefaultFormValues()
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
          this.toggleLoading()
          this.close()
        })
    }
  }
}
</script>
