import { getAppliedSiteOptions, getJobCategoryOptionsByLang } from '@/constants/options'

// サイト名から当てはまる連想配列の要素を検索する
export const searchSiteFromOptions = (siteName) => {
  const siteList = getAppliedSiteOptions()
  const targetSite = siteList.find((site) => site.label === siteName)
  return [targetSite.value]
}

// 職業分類から当てはまる要素を検索する
export const searchCurrentJobFromOptions = (major, minor) => {
  const jobList = getJobCategoryOptionsByLang()
  const targetMajor = jobList.find((jobMajor) => {
    return (jobMajor.label === major)
  })
  const targetMinor = targetMajor.children.find((jobMinor) => {
    return (jobMinor.label === minor)
  })
  return [targetMajor.value, targetMinor.value]
}

