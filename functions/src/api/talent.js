const functions = require('firebase-functions')
const omit = require('lodash/omit')
const pick = require('lodash/pick')
const { companiesCollectionRef } = require('../plugins/firestore')
// const { NoAuthError } = require('../errors')
const { calcEstimatedMinutes } = require('../utils/question')
const { getTalentDocumentRefByIds } = require('./util.js')
const { Converter } = require('./converter')

/**
 * companyId と talentId から、talentのデータを取得する
 * @param {string} companyId
 * @param {string} talentId
 * @return {{ talentData: firebase.firestore.DocumentData & { id:string }, refereesData: (firebase.firestore.DocumentData & { id:string })[] }} talentドキュメントのデータ
 */
exports.get = functions
  .region('asia-northeast1')
  .https
  .onCall(async ({ companyId, talentId, awakeRun }) => {
    if (awakeRun) return null

    const companySnapshot = await companiesCollectionRef.doc(companyId).get()
    const { isFreemailAllowed } = companySnapshot.data()
    const talentSnapshot = await getTalentDocumentRefByIds(companyId, talentId).get()
    const talentData = talentSnapshot.data()
    const refereesSnapshot = await talentSnapshot.ref.collection('referees').orderBy('createdAt', 'asc').get()

    return {
      companyName: companySnapshot.data().name,
      talentData: {
        ...Converter.encodeDateFields(omit(talentData, 'questions')), // 候補者には質問が見えないようにする
        id: talentSnapshot.id,
      },
      isFreemailAllowed,
      // 言語によって質問が用意されていないせいで回答時間が変わる可能性があるが、日本語の場合の回答時間を返却
      estimatedMinutes: calcEstimatedMinutes({
        descriptionCount: talentData.questions.jp.descriptions.length,
        selectionCount: talentData.questions.jp.selections.length
      }),
      refereesData: refereesSnapshot.docs.map(doc => Converter.encodeDateFields({ ...doc.data(), id: doc.id }))
    }
  })

// talentドキュメントの更新を許可するフィールド
const ALLOWED_FIELDS = ['isAgreeToPrivacyPolicy', 'completedAt', 'isMailToRefereesSent', 'status', 'isUnsubscribeRemind', 'excusesToRegainTrust', 'excuseCompletedAt']
/**
 * talentドキュメントを更新する
 */
exports.update = functions
  .region('asia-northeast1')
  .https
  .onCall(async ({ companyId, talentId, data, awakeRun }) => {
    if (awakeRun) return null

    const talentDocumentRef = getTalentDocumentRefByIds(companyId, talentId)
    const updateData = Converter.decodeRefereeDateFields(pick(data, ALLOWED_FIELDS))
    return talentDocumentRef.update(updateData)
  })
