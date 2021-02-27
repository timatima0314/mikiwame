import { PLANS } from '@/utils/payment'
/**
 * ユーザーがスタンダードプランを選択していても、RISK EYES IDを管理者が登録しないとスタンダードプランが使えない
 * そのため、
 * - ライト
 * - スタンダード(申請中)
 * - スタンダード
 * の3ステータスを用意
 */
export const PLAN_STATUSES = {
  LIGHT: 'PLAN_STATUS_LIGHT',
  ORDERING_STANDARD: 'PLAN_STATUS_ORDERING_STANDARD',
  STANDARD: 'PLAN_STATUS_STANDARD'
}

export const PLAN_STATUS_TO_TEXT = {
  [PLAN_STATUSES.LIGHT]: 'ライト',
  [PLAN_STATUSES.ORDERING_STANDARD]: 'スタンダード(申請中)',
  [PLAN_STATUSES.STANDARD]: 'スタンダード'
}

/**
 * @param {object} arg
 * @param {typeof PLANS[keyof typeof PLANS]} arg.selected ユーザーが所望したプラン
 * @param {typeof PLANS[keyof typeof PLANS]} arg.allowed 管理者が許可したプラン
 */
export const getPlanStatus = ({ selected, allowed }) => {
  if (allowed === PLANS.STANDARD) return PLAN_STATUSES.STANDARD
  else if (selected === PLANS.STANDARD) return PLAN_STATUSES.ORDERING_STANDARD // ユーザーはスタンダードを所望してるけど、管理側が許してない -> スタンダード(申請中)

  return PLAN_STATUSES.LIGHT
}
