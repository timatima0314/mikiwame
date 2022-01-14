const functions = require('firebase-functions')
const { companiesCollectionRef } = require('../plugins/firestore')
const { sendMail, generteMailToRefereeTextfromTempalate, generateMailToRefereeHTMLfromTemplate, generteMailToTalentTextfromTempalate, generateMailToTalentHTMLfromTemplate } = require('./mail_util')
const { calcEstimatedMinutes } = require('../utils/question')
const { dayjs } = require('../plugins/localized_dayjs')

/**
 * 期限を過ぎても回答していない推薦者にリマインドメールを送信する
 */
module.exports = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '1GB'
  })
  .region('asia-northeast1') // 東京リージョン
  .pubsub
  .schedule('every day 12:00')
  .timeZone('Asia/Tokyo')
  .onRun(() =>
    companiesCollectionRef.get().then(companiesSnapshot =>
      companiesSnapshot.forEach(companyDoc =>
        // each company
        companyDoc.ref.collection('talents').get().then(talentsSnapshot =>
          talentsSnapshot.forEach(async talentDoc => {
            // each talent
            const talentData = talentDoc.data()
            if (talentData.completedAt) return // リファレンスチェックが完了している
            if (talentData.isUnsubscribeRemind) return // リマインドメールの配信停止を希望している

            const refereesSnapshot = await talentDoc.ref.collection('referees').get()
            // 推薦者を1人も登録していない場合
            if (refereesSnapshot.docs.length === 0 && shouldRemindDate(talentData.deadline.toDate())) {
              console.log(`send remind to talent: ${talentDoc.ref.path}`)
              return sendRemindToTalent({
                companyName: companyDoc.data().name,
                companyId: companyDoc.id,
                talentId: talentDoc.id,
                talentData,
              }).catch(console.error)
            }

            // everyは空の配列に対して呼び出すとtrueを返すことに注意
            const isAllRefereesCompleted = refereesSnapshot.docs.every(refereeDoc => Boolean(refereeDoc.data().completedAt))
            if (isAllRefereesCompleted) {
              // すべての推薦者がリファレンスチェックを終えている場合
              return talentDoc.ref.update({ completedAt: new Date() })
            }

            // リファレンスチェックを終えていない推薦者がいる場合
            refereesSnapshot.docs.forEach(async refereeDoc => {
              const refereeData = refereeDoc.data()
              if (refereeData.completedAt) return
              if (refereeData.isUnsubscribeRemind) return // リマインドメールの配信停止を希望している

              if (shouldRemindDate(talentData.deadline.toDate())) {
                console.log(`send remind to referee: ${refereeDoc.ref.path}`)
                // リファレンスチェックを終えていない かつ 条件を満たしている場合
                return sendRemindToReferee({
                  companyId: companyDoc.id,
                  talentId: talentDoc.id,
                  refereeId: refereeDoc.id,
                  talentData,
                  refereeData
                }).catch(console.error)
              }
            })
          })
        )
      )
    )
  )

/**
 * 当日がリマインドを行うべき日付かを判定する関数。
 * 「リファレンスチェックを終えていない」判定はすでになされている前提であり、この関数では行わない。
 * @param {Date} deadline
 * @returns {boolean}
 */
function shouldRemindDate(deadline) {
  const today = dayjs().startOf('day')
  // 締め切りの「前日」
  const beforeDayOfDeadline = dayjs(deadline).add(-1, 'days')
  if (today.isSame(beforeDayOfDeadline, 'day')) return true

  // 締切の「次の日」
  const nextDayOfDeadline = dayjs(deadline).add(1, 'days')
  if (today.isSame(nextDayOfDeadline, 'day')) return true

  return false
}

/**
 * 候補者にリマインドメールを送る
 * @param {object} arg
 * @param {string} arg.companyName
 * @param {string} arg.companyId
 * @param {string} arg.talentId
 * @param {string} arg.refereeId
 * @param {firebase.firestore.DocumentData} arg.talentData
 * @param {firebase.firestore.DocumentData} arg.refereeData
 */
async function sendRemindToTalent({ companyName, companyId, talentId, talentData }) {
  const deadlineString = dayjs(talentData.deadline.toDate()).format('MM月DD日')
  const templateArgs = {
    companyName,
    talentName: talentData.name,
    deadline: deadlineString,
    estimatedMinutes: calcEstimatedMinutes({
      descriptionCount: talentData.questions.jp.descriptions.length,
      selectionCount: talentData.questions.jp.selections.length
    }),
    linkToTalentPage: `https://${functions.config().dns.domain}/talent/instruction?company=${companyId}&token=${talentId}`,
    linkToUnsubscribe: `https://${functions.config().dns.domain}/talent/unsubscribe/remind?company=${companyId}&token=${talentId}`
  }

  const [text, html] = await Promise.all([
    generteMailToTalentTextfromTempalate(templateArgs),
    generateMailToTalentHTMLfromTemplate(templateArgs)
  ])

  return sendMail({
    to: talentData.email,
    subject: `【MiKiWaMe Point】再送: リファレンスチェックのお願い(期限: ${deadlineString})`,
    text,
    html
  })
}


/**
 * 推薦者にリマインドメールを送る
 * @param {object} arg
 * @param {string} arg.companyId
 * @param {string} arg.talentId
 * @param {string} arg.refereeId
 * @param {firebase.firestore.DocumentData} arg.talentData
 * @param {firebase.firestore.DocumentData} arg.refereeData
 */
async function sendRemindToReferee({ companyId, talentId, refereeId, talentData, refereeData }) {
  const deadlineString = dayjs(talentData.deadline.toDate()).format('MM月DD日')
  const templateArgs = {
    refereeName: refereeData.name,
    talentName: talentData.name,
    deadline: deadlineString,
    estimatedMinutes: calcEstimatedMinutes({
      descriptionCount: talentData.questions.jp.descriptions.length,
      selectionCount: talentData.questions.jp.selections.length
    }),
    linkToRefereePage: `https://${functions.config().dns.domain}/referee/instruction?company=${companyId}&talent=${talentId}&token=${refereeId}`,
    linkToUnsubscribe: `https://${functions.config().dns.domain}/referee/unsubscribe/remind?company=${companyId}&talent=${talentId}&token=${refereeId}`
  }

  const [text, html] = await Promise.all([
    generteMailToRefereeTextfromTempalate(templateArgs),
    generateMailToRefereeHTMLfromTemplate(templateArgs)
  ])

  return sendMail({
    to: refereeData.email,
    subject: `【MiKiWaMe Point】再送: リファレンスチェックのお願い(期限: ${deadlineString})`,
    text,
    html
  })
}
