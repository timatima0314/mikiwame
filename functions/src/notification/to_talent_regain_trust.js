const functions = require('firebase-functions')
const { dayjs } = require('../plugins/localized_dayjs')
const { sendMail, generteMailToTalentRegainTrustTextfromTempalate, generateMailToTalentRegainTrustHTMLfromTemplate } = require('./mail_util')
const { companiesCollectionRef } = require('../plugins/firestore')
const { NoAuthError } = require('../errors')

/**
 * 候補者に、コミュニケーション機能を用いた質問に対する回答を促すメールを送信
 * @use functions.httpsCallable('sendMailToTalentRegainTrustByIds')({ companyId: <companyドキュメントのid>, talentId: <talentドキュメントのid> })
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const { companyId, talentId } = data
    const companySnapshot = await companiesCollectionRef.doc(companyId).get()
    const { name: companyName } = companySnapshot.data()
    const talentSnapshot = await companySnapshot.ref.collection('talents').doc(talentId).get()
    const { name: talentName, email, excuseDeadline } = talentSnapshot.data()
    const deadlineString = dayjs(excuseDeadline.toDate()).format('MM月DD日')
    const templateArgs = {
      companyName,
      talentName,
      deadline: deadlineString,
      linkToRegainTrustPage: `https://${functions.config().dns.domain}/regain_trust/instruction?company=${companyId}&token=${talentId}`
    }

    const [text, html] = await Promise.all([
      generteMailToTalentRegainTrustTextfromTempalate(templateArgs),
      generateMailToTalentRegainTrustHTMLfromTemplate(templateArgs)
    ])

    return sendMail({
      to: email,
      subject: `【MiKiWaMe Point】リファレンスチェックの内容について確認のお願い(期限: ${deadlineString})`,
      text,
      html
    })
  })
