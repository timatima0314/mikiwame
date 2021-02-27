const functions = require('firebase-functions')
const { sendMail, generteMailToSubAccountTextfromTempalate, generateMailToSubAccountHTMLfromTemplate } = require('./mail_util')
const { companiesCollectionRef } = require('../plugins/firestore')
const { NoAuthError } = require('../errors')

/**
 * サブアカウントにパスワードの設定を促すメールを送信
 * @use functions.httpsCallable('notifySubAccountToSetPassword')({ companyId: <companyドキュメントのid>, subAccountId: <subAccountドキュメントのid> })
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const { companyId, subAccountId } = data
    const companySnapshot = await companiesCollectionRef.doc(companyId).get()
    const { name: companyName } = companySnapshot.data()
    const subAccountSnapshot = await companiesCollectionRef.doc(companyId).collection('subAccounts').doc(subAccountId).get()
    const { name: subAccountName, email } = subAccountSnapshot.data()
    const templateArgs = {
      companyName,
      subAccountName,
      linkToPasswordSettingPage: `https://${functions.config().dns.domain}/signup/sub_account?company=${companyId}&token=${subAccountId}`
    }

    const [text, html] = await Promise.all([
      generteMailToSubAccountTextfromTempalate(templateArgs),
      generateMailToSubAccountHTMLfromTemplate(templateArgs)
    ])

    return sendMail({
      to: email,
      subject: '【MiKiWaMe Point】新規アカウントのパスワード設定のお願い',
      text,
      html
    })
  })
