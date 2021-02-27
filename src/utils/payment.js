import { DEFAULT_MONTHLY_PRICE, TAX_PERCENTAGE } from '@/constants/billing'

// プランが増えたときのためにisLightPlan(boolean)ではなく、定数化しておく
export const PLANS = {
  LIGHT: 'LIGHT',
  STANDARD: 'STANDARD'
}

/**
 * 月額の利用料金(税込み)を計算する
 * 1. スタンダードプラン: 基本⽉額1万円・1アカウント800円。反社チェックは⽉額1万円・検索、閲覧、にて従量課⾦
 *                     ⽉額（税抜合計) = 20000 + 800 * (サブアカウント数) + (検索、閲覧での従量課⾦)
 * 2. ライトプラン:      基本⽉額1万円・1アカウント800円。
 *                     ⽉額（税抜合計) = 10000 + 800 * (サブアカウント数)
 * @param {object} arg
 * @param {'LIGHT' | 'STANDARD'} arg.plan true: ライトプラン
 * @param {number} arg.subAccountCount その会社のサブアカウント数 + 本アカウント1つ の合計
 * @param {number} arg.otherBilling その他、追加して請求する金額。従量課金APIの使用量など
 */
export const calcMonthlyPayment = ({ plan = PLANS.LIGHT, subAccountCount = 0, otherBilling = 0 }) => {
  const withoutTax = (() => {
    switch (plan) {
      case PLANS.STANDARD:
        // 1. スタンダードプラン
        return DEFAULT_MONTHLY_PRICE * 2 + 800 * subAccountCount + otherBilling
      case PLANS.LIGHT:
      default:
        // 2. ライトプラン or 引数をミスったとき
        return DEFAULT_MONTHLY_PRICE + 800 * subAccountCount
    }
  })()

  // 小数計算は誤差が出るので、untaxed * 110 / 100のようにする
  return Math.ceil(withoutTax * (100 + TAX_PERCENTAGE) / 100)
}
