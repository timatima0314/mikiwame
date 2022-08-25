<template>
  <div>
    <el-dialog :visible="showModal" :title="errorMessage" :show-close="false" center>
      <template v-if="!isVerified">
        <div class="text-center">
          <h3>ご登録頂き、ありがとうございます。<br>
            現在、登録情報の認証ならびに審査を行っております。<br>
            30〜60分程度、お時間を頂戴することもございます。<br>
            今しばらく、お待ちください。</h3>
          <p>お問合せ先</p>
          <address>
            <p>お電話: 03-5324-2351</p>
            <p>メール: <a target="_blank" :href="mailLink" style="color: deepskyblue">contact@hrrt.co.jp</a></p>
          </address>
        </div>
      </template>
      <template v-else-if="!isTrial && !isCardValid">
        <div class="text-center">
          <p>設定が完了するまで、機能が制限されます</p>
        </div>
        <div class="link-to-setting">
          <router-link :to="{ name: 'configCard' }">
            <i class="el-icon-caret-right" />
            クレジットカードを設定する
          </router-link>
        </div>
      </template>
      <div style="text-align: right; margin-top: 1rem;">
        <el-button @click="logout">ログアウト</el-button>
      </div>
    </el-dialog>

    <template v-if="$route.name === 'config'">
      <el-dialog :visible.sync="showTrialModal" :title="'無料試用期間残り：' + ttlTrial + '日'" center>
        <div style="text-align: center">
          <p>試用期間終了後にサービスを利用するにはクレジットカードを登録してください</p>
          <el-button @click="gotoConfigCard">クレジットカードを設定する</el-button>
        </div>
      </el-dialog>
    </template>

    <el-dialog :visible="!isAdmin && isFirstTimeLogin" :show-close="false" center>
      <div class="text-center">
        <h3>お申し込みいただきありがとうございます<br>
          まずは{{ traialPeriod }}日間無料でお試しいただけます</h3>
        <p class="text-left">
          最初の設定として<br>
          ・名刺、フリーメールアドレスの設定をしてください
          <router-link style="color: deepskyblue" :to="{name: 'config' }" @click.native="updateLoginCount">設定ページはこちら</router-link><br>
          ・弊社システムから送信されているメールアドレスは、info@mikiwame-p.jpとなりますので、受信設定許可をお願い致します。
        </p>
        <div style="text-align: right; margin-top: 1rem;">
          <el-button @click="updateLoginCount">OK</el-button>
        </div>
      </div>
    </el-dialog>

    <slot v-if="!showModal" />
  </div>
</template>

<script>
import get from 'lodash/get'
import { companiesCollectionRef } from '@/plugins/firebase'
import { mapGetters } from 'vuex'
import { TRIAL_PERIOD } from '@/constants/billing'
import dayjs from 'dayjs'
import { updateCompany } from '@/utils/hooks/firestore'
import { isTrial } from '@/utils/isTrial'

export default {
  name: 'ServiceValidationProvider',
  data: () => ({
    loading: true,
    unsubsucribe: () => {},
    companyName: null,
    isVerified: false,
    isCardValid: false,
    ttlTrial: null, // 残り無料試用期間
    showTrialModal: false,
    isFirstTimeLogin: false, // １回目のログインであるか
    traialPeriod: null,
    isTrial: false
  }),
  computed: {
    ...mapGetters(['companyId', 'isAdmin']),
    showModal() {
      if (this.loading) return false
      if (this.isAdmin) return false
      if (this.isVerified) return true
      if (!this.isTrial && !this.isCardValid) {
        if (this.$route.name === 'configCard') return false
        else return true
      }
      return false
    },
    errorMessage() {
      if (!this.isVerified) return ''
      else if (this.isCardValid === undefined) return 'クレジットカードが設定されていません'
      else if (this.isCardValid === false) return 'クレジットカードが無効です'
      else return ''
    },
    mailLink() {
      const address = 'contact@hrrt.co.jp'
      const subject = 'MiKiWaMe Point のお問い合わせ'
      const body = `会社名: ${this.companyName}\n会社ID: ${this.companyId}\n` + '-'.repeat(50)
      return encodeURI(`mailto:${address}?subject=${subject}&body=${body}`)
    }
  },
  created() {
    this.unsubsucribe = companiesCollectionRef.doc(this.companyId).onSnapshot(snapshot => {
      const data = snapshot.data()
      // 試用期間となる対象であればtrue
      this.isTrial = isTrial(data)
      this.companyName = data.name
      this.isVerified = Boolean(data.verifiedAt)
      this.isFirstTimeLogin = data.loginCount === 1
      this.isCardValid = get(data, 'creditCard.valid')
      this.ttlTrial = TRIAL_PERIOD - dayjs(new Date()).diff(data.createdAt?.toDate(), 'days')
      this.allowedPlan = data.allowedPlan
      this.loading = false
      this.showTrialModal = this.isTrial // 無料試用期間モーダルを表示するか否かを設定
      this.traialPeriod = TRIAL_PERIOD
    })
  },
  beforeDestroy() {
    this.unsubsucribe()
  },
  methods: {
    logout() {
      return this.$store.dispatch('user/logout').then(() => {
        this.$router.push('/login')
      })
    },
    gotoConfigCard() {
      this.$router.push({ path: '/config/card', query: this.$route.query })
      this.showTrialModal = false
    },
    updateLoginCount() {
      // 初回ログインのポップアップを消した後にもloginCountが1のままだと、
      // ページを再読み込みした際に再びポップアップが出てしまうため、
      // 初回ログインポップアップを消した後の状態を便宜上-1とした(loginCountの本分から逸脱してるので良くない)
      updateCompany({ companyId: this.companyId, data: { loginCount: -1 }}).catch(() => {})
    }
  }
}
</script>

<style lang="sass" scoped>
.text-center
  text-align: center
.text-left
  text-align: left
  margin: 0 2rem
.link-to-setting
  text-align: right
  margin-top: 2rem
  color: skyblue
</style>
