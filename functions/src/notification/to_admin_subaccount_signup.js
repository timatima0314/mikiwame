const functions = require('firebase-functions')
const { adminConfigRef, companiesCollectionRef } = require('../plugins/firestore')
const { NoAuthError } = require('../errors')
const { sendMail } = require('./mail_util')

/**
 * サブアカウントがサインアップしたときに、管理者へ登録を知らせるメールを送信する
 * @param {string} companyId companyドキュメントのid
 * @param {string} subAccountId subAccountドキュメントのid
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const { companyId, subAccountId } = data
    const adminConfigSnapshot = await adminConfigRef.get()
    const { mail } = adminConfigSnapshot.data()
    if (mail === undefined) throw new functions.https.HttpsError('notify target mail has not set')

    const companySnapshot = await companiesCollectionRef.doc(companyId).get()
    const { name: companyName } = companySnapshot.data()
    const subAccountSnapshot = await companySnapshot.ref.collection('subAccounts').doc(subAccountId).get()
    const { name: subAccountName } = subAccountSnapshot.data()

    const text = `
      ${companyName}の企業担当者が新規登録されました<br><br>

      アカウント名：${subAccountName}
    `

    return sendMail({
      to: mail,
      subject: '【MiKiWaMe Point】企業担当者新規登録',
      text,
      html: text
    })
  })
