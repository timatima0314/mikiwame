const functions = require('firebase-functions')
const { dayjs } = require('../plugins/localized_dayjs')
const { sendMail, generteMailToRefereeTextfromTempalate, generateMailToRefereeHTMLfromTemplate } = require('./mail_util')
const { companiesCollectionRef } = require('../plugins/firestore')
const { calcEstimatedMinutes } = require('../utils/question')
const { NoAuthError } = require('../errors')

// 2020/12 推薦者への回答依頼はメールではなくURL発行によって行う事となったため未使用

/**
 * 推薦者にリファレンスチェック回答を促すメールを送信
 * @use functions.httpsCallable('sendMailToRefereeByIds')({ companyId: <companyドキュメントのid>, talentId: <talentドキュメントのid>, refereeId: <refereeドキュメントのid> })
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const { companyId, talentId, refereeId } = data
    const talentSnapshot = await companiesCollectionRef.doc(companyId).collection('talents').doc(talentId).get()
    const { name: talentName, deadline, questions } = talentSnapshot.data()
    const refereeSnapshot = await talentSnapshot.ref.collection('referees').doc(refereeId).get()
    const { name: refereeName, email } = refereeSnapshot.data()
    const deadlineString = dayjs(deadline.toDate()).format('MM月DD日')
    const estimatedMinutes = calcEstimatedMinutes({ descriptionCount: questions.jp.descriptions.length, selectionCount: questions.jp.selections.length })
    const templateArgs = {
      refereeName,
      talentName,
      deadline: deadlineString,
      estimatedMinutes,
      linkToRefereePage: `https://${functions.config().dns.domain}/referee/instruction?company=${companyId}&talent=${talentId}&token=${refereeId}`,
      linkToUnsubscribe: `https://${functions.config().dns.domain}/referee/unsubscribe/remind?company=${companyId}&talent=${talentId}&token=${refereeId}`
    }

    const [text, html] = await Promise.all([
      generteMailToRefereeTextfromTempalate(templateArgs),
      generateMailToRefereeHTMLfromTemplate(templateArgs)
    ])

    return sendMail({
      to: email,
      subject: `【MiKiWaMe Point】リファレンスチェックのお願い(期限: ${deadlineString})`,
      text,
      html
    })
  })
