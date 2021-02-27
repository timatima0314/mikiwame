const functions = require('firebase-functions')
const { admin } = require('../plugins/admin')
const { companiesCollectionRef } = require('../plugins/firestore')
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
    const companySnapshot = await companiesCollectionRef.doc(companyId).get()
    const { name, uid } = companySnapshot.data()
    const { email } = await admin.auth().getUser(uid)

    const text = `
      ${name}様<br><br>

      スタンダードプランへのアップグレードが完了いたしました。<br><br>
      
      ■MiKiWaMe Pointへアクセスする<br>
      https://${functions.config().dns.domain}
    `

    return sendMail({
      to: email,
      subject: '【MiKiWaMe Point】プランアップグレードの完了',
      text,
      html: text
    })
  })