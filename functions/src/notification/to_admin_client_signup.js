const functions = require('firebase-functions')
const { adminConfigRef, companiesCollectionRef } = require('../plugins/firestore')
const { NoAuthError } = require('../errors')
const { sendMail } = require('./mail_util')

/**
 * クライアントがサインアップしたときに、管理者へプランを知らせるメールを送信する
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

    const companySnapshot = await companiesCollectionRef.doc(companyId).get()
    const { name, staffName, email, address, selectedPlan } = companySnapshot.data()
    const selectedPlanText = selectedPlan === 'LIGHT' ? 'ライトプラン' : 'スタンダードプラン'

    const text = `
      ユーザーが新規登録しました<br><br>

      会社名：${name}<br>
      担当者氏名：${staffName}<br>
      メールアドレス：${email}<br>
      住所: ${address}<br>
      プラン：${selectedPlanText}<br><br>

      ■管理画面の該当ページ<br>
      https://${functions.config().dns.domain}/admin?company=${companyId}
    `

    return sendMail({
      to: mail,
      subject: '【MiKiWaMe Point】ユーザー新規登録',
      text,
      html: text
    })
  })
