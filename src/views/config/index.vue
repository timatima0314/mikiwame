<template>
  <el-form ref="form" :model="form" class="container" label-width="220px" :rules="rules">
    <h1>設定</h1>
    <el-form-item v-if="!isAdmin&&!isSubAccount" label="会社名">
      <el-input v-model="form.companyName" placeholder="株式会社HRRT" prefix-icon="el-icon-office-building" />
      <span style="color: tomato">※候補者へのメールで表示されます</span>
    </el-form-item>
    <el-form-item v-if="isAdmin" label="ショップID">
      <el-input v-model="form.shopID" prefix-icon="el-icon-office-building" />
      <span style="color: tomato">※GMOショップ管理画面のショップIDをご入力ください</span>
    </el-form-item>
    <el-form-item label="氏名">
      <el-input v-model="form.displayName" placeholder="ご自身のお名前" prefix-icon="el-icon-user" />
    </el-form-item>
    <el-form-item label="メールアドレス">
      <el-input v-model="form.email" placeholder="ご自身のメールアドレス" prefix-icon="el-icon-message" />
    </el-form-item>
    <el-form-item v-if="!isSubAccount" label="郵便番号(ハイフンなし)">
      <el-input v-model="form.zipcode" placeholder="例: 1070062" prefix-icon="el-icon-receiving" type="number" />
    </el-form-item>
    <el-form-item v-if="!isSubAccount" label="ご住所">
      <el-input v-model="form.address" placeholder="例: 東京都港区南青山3丁目8番40号 青山センタービル2F" prefix-icon="el-icon-house" />
    </el-form-item>
    <!-- SMS送信処理などが必要なためPENDING -->
    <!-- <el-form-item label="電話番号(ハイフンなし)">
      <el-input v-model="form.phoneNumber" placeholder="ご自身の電話番号" prefix-icon="el-icon-phone" />
    </el-form-item> -->
    <el-form-item label="パスワード" prop="password">
      <el-button v-show="!showPasswordForm" :loading="loading" icon="el-icon-lock" @click="showPasswordForm = true">パスワードを変更する</el-button>
      <el-input v-if="showPasswordForm" v-model="form.password" placeholder="新しいパスワード" type="password" />
    </el-form-item>
    <el-form-item v-if="showPasswordForm" prop="passwordConf">
      <el-input v-model="form.passwordConf" placeholder="確認のためもう一度ご入力ください" type="password" />
    </el-form-item>
    <el-form-item v-if="isAdmin" label="運用通知">
      <el-input v-model="form.adminMail" placeholder="通知を受信するメールアドレス" prefix-icon="el-icon-message" />
    </el-form-item>
    <el-form-item v-if="!isAdmin&&!isSubAccount" label="クレジットカード">
      <div>{{ maskedCardNo || 'カードが登録されていません' }}</div>
    </el-form-item>

    <div v-if="!isSubAccount" class="config-switch">
      <el-row :gutter="20">
        <el-col :span="16" :offset="2">
          推薦者の本⼈確認資料である証明画像の取得設定について<br>
          取得する ( ON )・しない ( OFF ) <span class="switch-caution"> ※1</span>
        </el-col>
        <el-col :span="6"><el-switch v-model="form.isBusinessCardRequired" /></el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="16" :offset="2">
          求職者が登録する推薦者のフリーメールアドレスについて<br>
          許可する ( ON )・しない ( OFF ) <span class="switch-caution"> ※2</span>
        </el-col>
        <el-col :span="6"><el-switch v-model="form.isFreemailAllowed" /></el-col>
      </el-row>
    </div>

    <div v-if="!isAdmin&&!isSubAccount" class="not-form-button" style="margin-top: 40px;">
      <el-button @click="$router.push({ name: 'configCard' })">クレジットカード設定</el-button>
      <el-button type="info" plain @click="goToWithdrawal"><span style="padding: 0 16px">退会</span></el-button>
    </div>

    <div class="not-form-button">
      <el-button :loading="loading" type="primary" @click="onSubmit"><span style="padding: 0 22px">設定を更新する</span></el-button>
      <el-button :loading="loading" @click="onReset">リセット</el-button>
    </div>

    <div v-if="!isSubAccount" style="margin-top: 30px">
      <span class="caution-title">注意事項</span>
      <p>
        ※1 本人確認証明画像について
        <ul>
          <li>実施されますと「なりすまし防止」に役立ちます。</li>
          <li>実施しない場合、回答の信憑性に影響が出る可能性がございます。</li>
        </ul>
      </p>
      <p>
        ※2 フリーメールについて
        <ul>
          <li>使用を許可しない場合、現在の就業している会社のドメインで送付されて来る為、回答について一定の信憑性が担保されます。</li>
          <li>使用を許可した場合、回答の信憑性が下がる可能性がございます</li>
        </ul>
      </p>
    </div>
    <div style="height: 3rem" />
  </el-form>
</template>

<script>
import get from 'lodash/get'
import { mapGetters } from 'vuex'
import { normalizePhoneNumber } from '@/utils/phone'
import { useCompany, useSubAccount, updateCompany, updateSubAccount } from '@/utils/hooks/firestore'
import { adminConfigsRef } from '@/plugins/firebase'
import * as Sentry from '@sentry/vue'

export default {
  name: 'Config',
  data: () => ({
    loading: true,
    showPasswordForm: false,
    form: {
      displayName: '',
      companyName: '',
      email: '',
      zipcode: null,
      address: '',
      phoneNumber: '',
      password: null,
      passwordConf: null,
      adminMail: '',
      isBusinessCardRequired: true,
      isFreemailAllowed: false
    },
    maskedCardNo: null

  }),
  computed: {
    ...mapGetters(['user', 'isAdmin', 'companyId', 'isSubAccount', 'subAccountId']),
    rules() {
      const passwordLength = (rule, value, callback) => {
        const { password } = this.form
        if (password === null) return callback() // パスワード変更ボタンが押されていない
        if (password.length < 6) return callback(new Error('パスワードは6文字以上入力してください'))
        callback()
      }
      const matchPassword = (rule, value, callback) => {
        const { password, passwordConf } = this.form
        if (password === null && passwordConf === null) return callback() // パスワード変更ボタンが押されていない
        if (password !== passwordConf) return callback(new Error('パスワードが一致しません'))
        callback()
      }

      return {
        password: [{ validator: passwordLength, trigger: 'blur' }],
        passwordConf: [{ validator: matchPassword, trigger: 'blur' }]
      }
    }
  },
  async created() {
    const { companyData } = await useCompany({ companyId: this.companyId })
    const { subAccountData } = this.isSubAccount
      ? await useSubAccount({ companyId: this.companyId, subAccountId: this.subAccountId })
      : { subAccountData: null }
    this.maskedCardNo = get(companyData, 'creditCard.maskedCardNo')
    this.form = {
      ...this.form,
      companyName: companyData.name,
      displayName: get(subAccountData, 'name') || get(companyData, 'staffName'),
      email: this.user.email,
      isBusinessCardRequired: companyData.isBusinessCardRequired,
      isFreemailAllowed: companyData.isFreemailAllowed,
      zipcode: companyData.zipcode,
      address: companyData.address,
      phoneNumber: normalizePhoneNumber(this.user.phoneNumber)
    }
    if (this.isAdmin) {
      const adminSnapshot = await adminConfigsRef.get()
      const adminData = adminSnapshot.data()
      this.form = {
        ...this.form,
        shopID: adminData.shopID,
        adminMail: adminData.mail
      }
    }
    this.loading = false
  },
  methods: {
    async onSubmit() {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) return

      try {
        this.loading = true
        const subAccountData = {
          name: this.form.displayName,
          email: this.form.email
        }
        const mainAccountData = {
          name: this.form.companyName,
          staffName: this.form.displayName,
          email: this.form.email,
          zipcode: this.form.zipcode || null,
          address: this.form.address || '',
          isBusinessCardRequired: this.form.isBusinessCardRequired,
          isFreemailAllowed: this.form.isFreemailAllowed
        }
        await Promise.all([
          ...(this.isSubAccount
            ? [updateSubAccount({ companyId: this.companyId, subAccountId: this.subAccountId, data: subAccountData })]
            : [updateCompany({ companyId: this.companyId, data: mainAccountData })]
          ),
          ...(this.isAdmin ? [adminConfigsRef.update({ shopID: this.form.shopID, mail: this.form.adminMail })] : []),
          this.user.updateEmail(this.form.email)
        ])

        if (this.form.password !== null) {
          await this.user.updatePassword(this.form.password)
        }
        this.showPasswordForm = false

        this.$message({ message: '設定の更新に成功しました', type: 'success' })
      } catch (err) {
        Sentry.captureException(new Error(err))
        this.$message({ message: '設定の更新に失敗しました', type: 'error' })
      } finally {
        this.loading = false
      }
    },
    onReset() {
      this.$router.go({ name: 'config' })
    },
    goToWithdrawal() {
      this.$router.push('/withdrawal')
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  width: 80%
  margin: auto
.not-form-button
  padding-left: 220px
  padding-bottom: 20px
.config-switch
  color: #606266
  margin-left: 30px
  font-size: 14px
  font-weight: 700
.switch-caution
  font-size: 12px
  font-weight: 400
.caution-title
  font-size: 20px
  font-weight: 800
</style>
