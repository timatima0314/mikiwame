import { TRIAL_PERIOD } from '@/constants/billing'
import dayjs from 'dayjs'

/**
 * 試用期間となる対象であればtrueを返す
 * @param {object} companyData
 */
// 試用期間の条件
// スタンダードプランではなく、登録から10日(TRIAL_PERIOD)以内
export function isTrial(companyData) {
  if (companyData.createdAt == null) return false

  let createdAt
  // secondsプロパティを持っているならTimestampであるため、Dateオブジェクトへ変換
  if (companyData.createdAt.seconds != null) createdAt = companyData.createdAt.toDate()
  else createdAt = companyData.createdAt

  const ttlTrial = TRIAL_PERIOD - dayjs(new Date()).diff(createdAt, 'days')
  return companyData.allowedPlan !== 'STANDARD' && ttlTrial >= 0
}
