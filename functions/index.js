/* global process */
const willFuncRequire = funcName => {
  const functionName = process.env.FUNCTION_NAME || process.env.K_SERVICE
  // ローカルで動かす際はすべて読み込む
  if (!functionName) return true

  // cloud で実行する際は FUNCTION_NAME or K_SERVICE 環境変数に実行される関数名が入る。
  // https://tech.ginco.io/post/ginco-engineer-meetup-2018-cloud-functions/#cloud-firestore%E3%81%AEclient%E3%81%AEcold-start%E3%81%AE%E6%94%B9%E5%96%84
  // この関数の返り値が true のときのみ読み込むようにする
  return functionName === funcName
}

// 自動バックアップcron処理
if (willFuncRequire('autoBackupFirestore')) exports.autoBackupFirestore = require('./src/cron/auto_backup_firestore')
if (willFuncRequire('autoBackupAuth')) exports.autoBackupAuth = require('./src/cron/auto_backup_auth')
if (willFuncRequire('awakeFunctions')) exports.awakeFunctions = require('./src/cron/awake_functions')

if (willFuncRequire('isPhoneNumberRegistered')) exports.isPhoneNumberRegistered = require('./src/auth/phone')
if (willFuncRequire('isRefereePhoneNumberRegistered')) exports.isRefereePhoneNumberRegistered = require('./src/auth/phone_referee')
if (willFuncRequire('toggleAuthDisabled')) exports.toggleAuthDisabled = require('./src/auth/toggle_disabled')
if (willFuncRequire('getCompanyByUid')) exports.getCompanyByUid = require('./src/api/company').getCompanyByMainUid
if (willFuncRequire('getCompanyBySubAccountUid')) exports.getCompanyBySubAccountUid = require('./src/api/company').getCompanyBySubUid
if (willFuncRequire('getSubAccountByUid')) exports.getSubAccountByUid = require('./src/api/company').getSubAccountByUid
if (willFuncRequire('pushToSubAccountUids')) exports.pushToSubAccountUids = require('./src/api/company').pushSubUid
if (willFuncRequire('deleteFromSubAccountUids')) exports.deleteFromSubAccountUids = require('./src/api/company').deleteSubUid
if (willFuncRequire('updateSubAccountByIds')) exports.updateSubAccountByIds = require('./src/api/company').updateSub
if (willFuncRequire('getTalentByIds')) exports.getTalentByIds = require('./src/api/talent').get
if (willFuncRequire('updateTalentByIds')) exports.updateTalentByIds = require('./src/api/talent').update
if (willFuncRequire('getRefereeByIds')) exports.getRefereeByIds = require('./src/api/referee').get
if (willFuncRequire('addRefereesByIds')) exports.addRefereesByIds = require('./src/api/referee').add
if (willFuncRequire('updateRefereesByIds')) exports.updateRefereesByIds = require('./src/api/referee').update
if (willFuncRequire('deleteRefereesByIds')) exports.deleteRefereesByIds = require('./src/api/referee').delete

if (willFuncRequire('sendMailToTalentByIds')) exports.sendMailToTalentByIds = require('./src/notification/to_talent')
if (willFuncRequire('sendMailToRefereeByIds')) exports.sendMailToRefereeByIds = require('./src/notification/to_referee')
if (willFuncRequire('notifyAdminClientSignup')) exports.notifyAdminClientSignup = require('./src/notification/to_admin_client_signup')
if (willFuncRequire('notifyAdminOrderedPlanUpgrade')) exports.notifyAdminOrderedPlanUpgrade = require('./src/notification/to_admin_ordered')
if (willFuncRequire('notifyCompanyEndPlanUpgrade')) exports.notifyCompanyEndPlanUpgrade = require('./src/notification/to_company')
if (willFuncRequire('notifyCompanyAvailable')) exports.notifyCompanyAvailable = require('./src/notification/to_company_available')
if (willFuncRequire('remindToTalentsAndReferees')) exports.remindToTalentsAndReferees = require('./src/notification/remind')
if (willFuncRequire('notifySubAccountToSetPassword')) exports.notifySubAccountToSetPassword = require('./src/notification/to_subaccount')
if (willFuncRequire('notifyAdminToSubAccountSignup')) exports.notifyAdminToSubAccountSignup = require('./src/notification/to_admin_subaccount_signup')
if (willFuncRequire('notifyAdminWithdrawal')) exports.notifyAdminWithdrawal = require('./src/notification/to_admin_withdrawal')
if (willFuncRequire('sendMailToTalentRegainTrustByIds')) exports.sendMailToTalentRegainTrustByIds = require('./src/notification/to_talent_regain_trust')

if (willFuncRequire('fetchAndSaveRiskCheck')) exports.fetchAndSaveRiskCheck = require('./src/risk_eyes/clip_count')
if (willFuncRequire('getRiskCheckResultUrl')) exports.getRiskCheckResultUrl = require('./src/risk_eyes/clip_list')

if (willFuncRequire('createOrUpdateCreditCard')) exports.createOrUpdateCreditCard = require('./src/payment/usecase/createOrUpdateCreditCard')

if (willFuncRequire('evaluateSelectionAnswers')) exports.evaluateSelectionAnswers = require('./src/answers/evaluation')
