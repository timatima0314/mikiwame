const functions = require('firebase-functions')
const axios = require('axios').default

/**
 * コールドスタート対策として、定期的に関数を呼び出す
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .pubsub
  .schedule('every 10 minutes') // 10分毎に
  .timeZone('Asia/Tokyo')
  .onRun(async() => {
    /* global process */
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT
    const prefix = `https://asia-northeast1-${projectId}.cloudfunctions.net/`
    const functionEndpoints = [
      // ここにawakeFunctionsを入れると無限ループを起こして破産するので、最新の注意を払うこと。
      'addRefereesByIds',
      'createOrUpdateCreditCard',
      'deleteFromSubAccountUids',
      'deleteRefereesByIds',
      'evaluateSelectionAnswers',
      'fetchAndSaveRiskCheck',
      'getCompanyBySubAccountUid',
      'getCompanyByUid',
      'getRefereeByIds',
      'getRiskCheckResultUrl',
      'getSubAccountByUid',
      'getTalentByIds',
      'isPhoneNumberRegistered',
      'notifyAdminClientSignup',
      'notifyAdminOrderedPlanUpgrade',
      'notifyAdminToSubAccountSignup',
      'notifyAdminWithdrawal',
      'notifyCompanyAvailable',
      'notifyCompanyEndPlanUpgrade',
      'notifySubAccountToSetPassword',
      'pushToSubAccountUids',
      'sendMailToRefereeByIds',
      'sendMailToTalentByIds',
      'toggleAuthDisabled',
      'updateRefereesByIds',
      'updateSubAccountByIds',
      'updateTalentByIds',
      'completeReferenceCheck'
    ]

    functionEndpoints.forEach(endpoint => {
      const url = prefix + endpoint
      const headers = { 'Content-Type': 'application/json' }
      axios.post(url, { data: { awakeRun: true }}, { headers }).catch(() => {})
    })
  })
