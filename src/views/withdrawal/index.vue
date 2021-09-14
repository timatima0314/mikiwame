<template>
  <div v-loading="loading" class="container">
    <span>MiKiWaMe Point 退会のお手続き</span>
    <el-card class="mt-1">
      <h2>退会する際の注意</h2>

      <div class="description">
        <p>本サービスを退会いたしますと、候補者や推薦者の情報を含む保存されていたすべてのお客様情報の閲覧および使用はできなくなります。</p>
        <p>退会後も数日の間は本サービスからのメール送信が行われる可能性がございますがご了承ください。</p>
        <p>利用料金について日割計算は行っておりません。月途中の解約でも1ヶ月分の料金は発生致します。</p>
        <p>退会後に再びサービスを使用したい場合は，本サービス担当へお問い合わせすることで再入会が可能です。</p>
      </div>

      <hr>

      <h2>アンケート</h2>

      <div class="description">
        <p>よろしければ退会理由を下記のアンケートにてお教えください。</p>
        <p>本アンケートの結果は今後のサービス向上のため有効に活用させていただきます。</p>
        <p>本アンケートの結果を第三者に公表することはありません。</p>
      </div>

      <br>

      <el-card>
        <el-form ref="form" :model="form" label-position="left" label-width="15rem" class="form-padding" :rules="rules">
          <el-form-item label="会社名" prop="companyName">
            <el-input v-model="form.companyName" />
          </el-form-item>

          <el-form-item label="氏名" prop="userName">
            <el-input v-model="form.userName" />
          </el-form-item>

          <el-form-item label="メールアドレス" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>

          <!-- TODO: クレジットカードの削除希望 -->

          <el-form-item label="退会理由（複数選択可）" prop="reasonsForWithdrawal.selections">
            <el-checkbox-group v-model="form.reasonsForWithdrawal.selections" class="description">
              <div v-for="(option, i) in options.reasonsForWithdrawal" :key="i">
                <el-checkbox :label="option.label">
                  {{ option.labelToDisplay }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="" prop="reasonsForWithdrawal.descriptions">
            <el-input
              v-model="form.reasonsForWithdrawal.descriptions"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 4}"
              placeholder="※自由記載（具体的にご記載ください）"
            />
          </el-form-item>
        </el-form>
      </el-card>

      <hr>

      <div class="mt-1 centerize">
        <el-button @click="$router.push('/config')">キャンセル</el-button>
        <el-button type="danger" @click="withdraw">退会する</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { functions, withdrawalQuestionnairesRef } from '@/plugins/firebase'
import { useCompany, updateCompany } from '@/utils/hooks/firestore'
import { mapGetters } from 'vuex'
import { getReasonsForWithdrawalOptions } from '@/constants/options'
import * as Sentry from '@sentry/vue'

export default {
  name: 'Index',
  data: () => ({
    loading: false,
    company: { name: '' },
    form: {
      companyName: '',
      userName: '',
      email: '',
      reasonsForWithdrawal: {
        selections: [],
        descriptions: ''
      }
    }
  }),
  computed: {
    // isAdmin iru?
    ...mapGetters(['user', 'isAdmin', 'companyId']),
    options: () => ({
      reasonsForWithdrawal: getReasonsForWithdrawalOptions()
    }),
    rules: () => ({
      companyName: [{ required: true, message: '会社名を入力してください', trigger: 'blur' }],
      userName: [{ required: true, message: '氏名を入力してください', trigger: 'blur' }],
      email: [
        { required: true, message: 'メールアドレスを入力してください', trigger: 'blur' },
        { type: 'email', message: 'メールアドレスの形式が無効です', trigger: 'blur' }
      ],
      reasonsForWithdrawal: {
        selections: [{ type: 'array', required: true, message: '少なくとも一つ選択してください', trigger: 'change' }],
        descriptions: [{ required: true, message: '退会理由を具体的にご記載ください', trigger: 'blur' }]
      }
    })
  },
  async created() {
    try {
      this.toggleLoading()
      const { companyDocumentSnapshot, companyData } = await useCompany({ companyId: this.companyId })
      if (companyData === undefined) this.$router.push('/404')

      this.company.name = companyDocumentSnapshot.name
    } catch (err) {
      Sentry.captureException(new Error(err))
    } finally {
      this.toggleLoading()
    }
  },
  methods: {
    toggleLoading() {
      this.loading = !this.loading
    },
    async withdraw() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) return

      const confirm = await this.$confirm('MiKiWaMe Point を退会します。本当によろしいですか？').catch(() => {})
      if (confirm === undefined) return

      this.toggleLoading()

      await withdrawalQuestionnairesRef.add({ ...this.form, companyId: this.companyId, createdAt: new Date() })
        .catch((err) => {
          Sentry.captureException(new Error(err))
        })

      await updateCompany({ companyId: this.companyId, data: { deletedAt: new Date() }})
      await functions.httpsCallable('toggleAuthDisabled')({ disabledValue: true, companyId: this.companyId })
      functions.httpsCallable('notifyAdminWithdrawal')({ companyId: this.companyId })
      // sendgrid の送信完了を待つと、3秒以上ローディングで待たされてしまう。そのため、完了を待たずに完了ページへ遷移。
      this.$router.push('/withdrawal/complete')
      this.toggleLoading()
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  width: 80%
  margin: 2rem auto
.text-bold
  font-weight: bold
.mt-1
  margin-top: 1rem
.centerize
  text-align: center
  justify-content: center
.pull-right
  margin-left: auto
.d-flex
  display: flex
  align-items: center
.description
  padding-left: 1rem
.form-padding
  padding-left: 2rem
.scrollable-container
  height: 23rem
  font-size: .7rem
  margin-bottom: 2rem
  padding: 2rem
  border: .1rem solid #dadada
  background-color: #f6f7fa
  line-height: 2.3rem
  overflow-y: auto
time
  color: #1a86f5
  font-size: 1.2em
  font-weight: bold
.step-text
  color: #303133
hr
  margin-bottom: 2rem
</style>
