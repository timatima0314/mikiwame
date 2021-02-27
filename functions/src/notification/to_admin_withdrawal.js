const functions = require('firebase-functions')
const { adminConfigRef, companiesCollectionRef, withdrawalQuestionnaireRef } = require('../plugins/firestore')
const { NoAuthError } = require('../errors')
const { sendMail } = require('./mail_util')
const { getReasonsForWithdrawalOptions } = require('../constants/options')

/**
 * クライアントが退会したことを管理者へアンケートの結果とともに送信する
 * @param {string} companyId companyドキュメントのid
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const { companyId } = data
    const adminConfigSnapshot = await adminConfigRef.get()
    const { mail } = adminConfigSnapshot.data()
    if (mail === undefined) throw new functions.https.HttpsError('notify target mail has not set')

    // 最新の退会アンケートを取得（同じユーザーが何度も退会&復活をした場合用）
    const withdrawalQuestionnaireSnapshot = await withdrawalQuestionnaireRef.where('companyId', '==', companyId).orderBy('createdAt', 'desc').limit(1).get()
    const [withdrawalQuestionnaireDoc] = withdrawalQuestionnaireSnapshot.docs
    const withdrawalQuestionnaireData = withdrawalQuestionnaireDoc.data()

    const companySnapshot = await companiesCollectionRef.doc(companyId).get()
    const companyData = companySnapshot.data()

    const textInfo = `
      ユーザーが退会しました<br><br>

      【アカウント情報】<br>
      会社名：${companyData.name || '--'}<br>
      氏名：${companyData.stafName || '--'}<br>
      メールアドレス：${companyData.email}<br><br>

      【ユーザー入力情報】<br>
      会社名：${withdrawalQuestionnaireData.companyName}<br>
      氏名：${withdrawalQuestionnaireData.userName}<br>
      メールアドレス：${withdrawalQuestionnaireData.email}<br><br>
    `

    let textSelections = '退会理由（選択）<br>'
    withdrawalQuestionnaireData.reasonsForWithdrawal.selections.map(select => textSelections += '・' + getReasonsForWithdrawalOptions.find(option => option.label === select).labelToDisplay + '<br>')

    const textDescriptions = `<br>退会理由（自由記述）：${withdrawalQuestionnaireData.reasonsForWithdrawal.descriptions}<br>`

    const text = textInfo + textSelections + textDescriptions

    return sendMail({
      to: mail,
      subject: '【MiKiWaMe Point】ユーザー退会処理',
      text,
      html: text
    })
  })
