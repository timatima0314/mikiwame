<template>
  <el-card v-loading="loading" class="container">
    <img src="@/assets/mikiwame_point_plan.png" style="vertical-align: middle; height: 80px;">
    <table class="plan-table">
      <thead>
        <tr>
          <td class="non" />
          <th class="light-plan">ライト</th>
          <th class="standard-plan">スタンダード</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>MiKiWaMe Point</td>
          <td><i class="el-icon-check" /></td>
          <td><i class="el-icon-check" /></td>
        </tr>
        <tr>
          <td>反社チェック</td>
          <td><i class="el-icon-close" /></td>
          <td><i class="el-icon-check" /></td>
        </tr>
        <tr>
          <td class="non" />
          <td class="non">
            <el-button class="plan-common" type="info" disabled>
              <b v-if="planStatus === PLAN_STATUSES.LIGHT">現在のプラン</b>
              <b v-else>ー</b>
            </el-button>
          </td>
          <td class="non">
            <el-button type="primary" class="order-button plan-common" :disabled="planStatus !== PLAN_STATUSES.LIGHT" @click="orderPlanUpgrade">
              <b v-if="planStatus === PLAN_STATUSES.LIGHT">このプランを申し込む</b>
              <b v-else-if="planStatus === PLAN_STATUSES.ORDERING_STANDARD">申請中</b>
              <b v-else-if="planStatus === PLAN_STATUSES.STANDARD">現在のプラン</b>
            </el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="price">
      <h3>■料金について（税込表示）</h3>
      <p>
        基本料金：月額11000円・1アカウント880円（人事担当者）<br>
        オプション：反社チェック：月額11000円・検索、閲覧、にて従量課金
      </p>
      <p>
        例)<br>
        スタンダードプランの場合<br>
        月額11000円・1アカウント880円（人事担当者）<br>
        反社チェック：月額11000円・検索、閲覧、にて従量課金<br>
        月額合計 22000円＋880円＋検索、閲覧、にて従量課金のご請求となります。<br>
        <br>
        ライトプラン：月額11000円＋1アカウント880円となります。<br>
        担当者様を追加する場合は、880円となります。
      </p>
      <p>
        ※反社チェックの従量課金について<br>
        ・新聞<span style="margin-left: 1em;">1検索：450円</span><br>
        <span style="margin-left: 1em">検索後の閲覧ボタンを押すと</span><br>
        <span style="margin-left: 1em;white-space: pre;">見出し</span><span style="margin-left: 1em;">記事5円（全国紙）10円（地方紙）</span><br>
        <span style="margin-left: 1em">本文閲覧料</span><span style="margin-left: 1em;">1記事100円（全国紙）150円（地方紙）課金</span><br>
        ・WEB<span style="margin-left: 1em;">1検索料：450円</span><br>
        <span style="margin-left: 1em">見出し、閲覧料は一切かかりません。</span><br>
      </p>
    </div>
    <div class="price">
      <h3>■契約期間</h3>
      <p>
        単月利用可能<br>
        ※退会した場合の注意事項について<br>
        ・登録情報の抹消（再利用の際は改めて登録が必要となります）<br>
        ・会社登録データの重複を避けるため、翌3ヶ月間は利用停止となります。
      </p>
    </div>
    <div class="price">
      <h3>■お支払方法とご請求について</h3>
      <p>
        ・法人クレジットカードのみ<br>
        <br>
        例） 1/1〜1/31までの間にご登録＝2月末支払い<br>
        ※日割り計算は対応せず、月額を満額請求させていただきます。
      </p>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { functions } from '@/plugins/firebase'
import { updateCompany } from '@/utils/hooks/firestore'
import { PLANS } from '@/utils/payment'
import { PLAN_STATUSES } from '@/utils/plan_statuses'

export default {
  name: 'CompanyPlan',
  data: () => ({ loading: false }),
  computed: {
    ...mapGetters(['companyId', 'planStatus']),
    PLAN_STATUSES: () => PLAN_STATUSES
  },
  methods: {
    async orderPlanUpgrade() {
      const confirm = await this.$confirm(`プランの変更を行いますが、よろしいですか？`).catch(() => {})
      if (confirm === undefined) return

      this.loading = true
      try {
        await updateCompany({ companyId: this.companyId, data: { selectedPlan: PLANS.STANDARD }})
        await functions.httpsCallable('notifyAdminOrderedPlanUpgrade')({ companyId: this.companyId })
        const title = 'お申し込みありがとうございます'
        const body = 'スタンダードプランが有効になるまでしばらくお待ち下さい。有効になりましたらメールでお知らせいたします'
        this.$alert(body, title)
        this.$store.commit('user/SET_PLAN_STATUS', PLAN_STATUSES.ORDERING_STANDARD)
      } catch (err) {
        this.$rollbar.error(err)
        this.$notify({ type: 'error', title: 'Error', message: '申込みに失敗しました。時間をおいて再度お試しください' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  body
    font-family: "Open Sans", sans-serif
    line-height: 1.25

  table
    border-collapse: collapse
    margin: 0 auto
    padding: 0
    width: 650px
    table-layout: fixed

  table tr
    background-color: #e6f2f5
    padding: .35em
    border-bottom: 2px solid #fff
    font-weight: bold

  table th,
  table td
    padding: 10px 10px 10px 10px
    /*margin: 10px 10px 10px 10px*/
    border-right: 10px solid #fff
    border-bottom: 10px solid #fff
    font-weight: bold
    font-size: 1.2rem
    text-align: center

  table th
    font-size: .85em

  table thead tr
    color: #fff
    font-size: 1.2rem

  .non
    background: #fff
    background-color: #fff
  .el-icon-check
    color: #00004c
    font-size: 2rem
  .el-icon-close
    color: tomato
    font-size: 2rem

  .light-plan
    background-color: #00004c
    padding: 1rem
    font-size: 1.2rem
    filter: drop-shadow(0 0 10px rgba(0,0,0,0.5))
    empty-cells: hide

  .standard-plan
    background-color: #00004c
    font-size: 1.2rem
    padding: 1rem
    filter: drop-shadow(0 0 10px rgba(0,0,0,0.5))
    empty-cells: hide

  .order-button
    background-color: #4bafea

  .plan-common
    width: 100%
    font-size: 0.9rem
    border-right: 0px solid
    -webkit-box-reflect: below 4px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(.7, transparent), to(white))
    -webkit-border-radius: 3px
    border-radius: 3px
    border: 0px solid #666

  h3
    letter-spacing: 2px
  .price
    border-bottom: 1px solid rgba(0, 0, 0, 0.2)
</style>
