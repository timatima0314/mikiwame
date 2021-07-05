const functions = require('firebase-functions')
const omit = require('lodash/omit')
const { getTalentDocumentRefByIds } = require('./util')
const { calcEstimatedMinutes } = require('../utils/question')
const { companiesCollectionRef } = require('../plugins/firestore')
// const { NoAuthError } = require('../errors')
const { Converter } = require('./converter')

/**
 * companyId と talentId と refereeId から、候補者ページ(+推薦者ページ)の表示に必要なデータを取得する
 * @param {string} companyId
 * @param {string} talentId
 * @param {string} refereeId
 * @return {{ companyN refereesData: (firebase.firestore.DocumentData & { id:string })[] }} companyData companyドキュメントのデータ
 */
exports.get = functions
  .region('asia-northeast1')
  .https
  .onCall(async ({ companyId, talentId, refereeId, awakeRun }) => {
    if (awakeRun) return null

    const companySnapshot = await companiesCollectionRef.doc(companyId).get()
    const { isBusinessCardRequired } = companySnapshot.data()
    const talentSnapshot = await getTalentDocumentRefByIds(companyId, talentId).get()
    const talentData = talentSnapshot.data()
    const refereeSnapshot = await talentSnapshot.ref.collection('referees').doc(refereeId).get()
    const refereesSnapshot = await talentSnapshot.ref.collection('referees').orderBy('createdAt', 'asc').get()
    const getGlobalPhoneNumber = (talent) => {
      if(!talent.phoneNumber || talent.phoneNumber.startsWith('+')) return talent.phoneNumber
      return `${talent.countryCode}${talent.phoneNumber.slice(1)}`
    } 
    return {
      talentName: talentData.name,
      // 推薦者の認証の際に、候補者の電話番号を弾くために使用
      talentPhoneNumber: getGlobalPhoneNumber(talentData),
      // 推薦者の認証の際に、他の推薦者と同様の電話番号を弾くために使用
      refereesPhoneNumber: refereesSnapshot.docs.map(doc => Converter.encodeDateFields({ ...doc.data(), id: doc.id }).phoneNumber),
      deadline: talentData.deadline.toDate().toJSON(),
      questions: talentData.questions,
      isBusinessCardRequired,
      // 言語によって質問が用意されていないせいで回答時間が変わる可能性があるが、日本語の場合の回答時間を返却
      estimatedMinutes: calcEstimatedMinutes({
        descriptionCount: talentData.questions.jp.descriptions.length,
        selectionCount: talentData.questions.jp.selections.length
      }),
      refereeData: Converter.decodeRefereeDateFields({ ...refereeSnapshot.data(), id: refereeSnapshot.id })
    }
  })

/**
 * referee を追加する(関数呼び出し回数を抑えるため、複数追加できるようにする)
 * @param {string} companyId
 * @param {string} talentId
 * @param {refereeData[]} referees refereeDataにidが含まれていても大丈夫
 */
exports.add = functions
  .region('asia-northeast1')
  .https
  .onCall(async ({ companyId, talentId, referees, awakeRun }) => {
    if (awakeRun) return null

    const talentDocumentRef = getTalentDocumentRefByIds(companyId, talentId)
    const results = await Promise.all(
      referees.map(
        referee => talentDocumentRef.collection('referees').add(Converter.decodeRefereeDateFields(omit(referee, 'id')))
      )

    )
    return results.map(res => res.id)
  })

/**
 * referee を更新する(関数呼び出し回数を抑えるため、複数更新できるようにする)
 * @param {string} companyId
 * @param {string} talentId
 * @param {refereeData[]} referees id を含めること
 */
exports.update = functions
  .region('asia-northeast1')
  .https
  .onCall(async ({ companyId, talentId, referees, awakeRun }) => {
    if (awakeRun) return null

    const talentDocumentRef = companiesCollectionRef.doc(companyId).collection('talents').doc(talentId)
    await Promise.all(
      referees.map(
        referee => talentDocumentRef.collection('referees').doc(referee.id).update(Converter.decodeRefereeDateFields(omit(referee, 'id')))
      )
    )
    return []
  })

/**
 * referee を削除する(関数呼び出し回数を抑えるため、複数削除できるようにする)
 * @param {string} companyId
 * @param {string} talentId
 * @param {string[]} refereeIds
 */
exports.delete = functions
  .region('asia-northeast1')
  .https
  .onCall(async ({ companyId, talentId, refereeIds, awakeRun }) => {
    if (awakeRun) return null

    const talentDocumentRef = companiesCollectionRef.doc(companyId).collection('talents').doc(talentId)
    await Promise.all(
      refereeIds.map(
        refereeId => talentDocumentRef.collection('referees').doc(refereeId).delete()
      )
    )
    return []
  })
