const functions = require('firebase-functions')
const { adminConfigRef, companiesCollectionRef } = require('../plugins/firestore')
const { NoAuthError } = require('../errors')
const { sendMail } = require('./mail_util')

/**
 * クライアントがプランのアップグレードを申し込んだときに、管理者へメールを送信する
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
    if (mail === undefined) throw new functions.https.HttpsError('notify target mail has not setted')

    const companySnapshot = await companiesCollectionRef.doc(companyId).get()
    const { name } = companySnapshot.data()

    const text = `
      会社名:${name}<br><br>

      スタンダードプランのお申込みがありました。<br><br>
      
      ■管理画面の該当ページ<br>
      https://${functions.config().dns.domain}/admin?company=${companyId}
    `

    return sendMail({
      to: mail,
      subject: '【MiKiWaMe Point】プランアップグレードの申込み',
      text,
      html: text
    })
  })