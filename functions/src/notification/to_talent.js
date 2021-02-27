const functions = require('firebase-functions')
const { dayjs } = require('../plugins/localized_dayjs')
const { sendMail, generteMailToTalentTextfromTempalate, generateMailToTalentHTMLfromTemplate } = require('./mail_util')
const { companiesCollectionRef } = require('../plugins/firestore')
const { calcEstimatedMinutes } = require('../utils/question')
const { NoAuthError } = require('../errors')
const { getI18n } = require('../constants/i18n')

/**
 * 候補者に推薦者登録を促すメールを送信
 * @use functions.httpsCallable('sendMailToTalentByIds')({ companyId: <companyドキュメントのid>, talentId: <talentドキュメントのid> })
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
    const { name: talentName, email, deadline, questions, language } = talentSnapshot.data()
    const deadlineString = (language === 'jp') ? dayjs(deadline.toDate()).format('MM月DD日') : dayjs(deadline.toDate()).format('MM/DD')
    const estimatedMinutes = calcEstimatedMinutes({ descriptionCount: questions[language].descriptions.length, selectionCount: questions[language].selections.length })
    // メール関連のi18nを取得し，言語を設定
    const mailI18n = getI18n('mail', language)

    const templateArgs = {
      companyName,
      talentName,
      deadline: deadlineString,
      mailI18n,
      estimatedMinutes,
      linkToTalentPage: `https://${functions.config().dns.domain}/talent/instruction?company=${companyId}&token=${talentId}`,
      linkToUnsubscribe: `https://${functions.config().dns.domain}/talent/unsubscribe/remind?company=${companyId}&token=${talentId}`
    }

    const [text, html] = await Promise.all([
      generteMailToTalentTextfromTempalate(templateArgs),
      generateMailToTalentHTMLfromTemplate(templateArgs)
    ])

    return sendMail({
      to: email,
      subject: mailI18n.t('subjectDeadline', { deadline: deadlineString }),
      text,
      html
    })
  })
