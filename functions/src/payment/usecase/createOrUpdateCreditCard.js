const functions = require('firebase-functions')
const { companiesCollectionRef } = require('../../plugins/firestore')
const get = require('lodash/get')
const { saveMember, saveCard } = require('../util')
const { NoAuthError } = require('../../errors')

/**
 * クレカ情報を登録or更新する
 * @param {string} companyId companyドキュメントのid
 * @param {string} token クレジットカード情報をトークン化したもの
 * @param {string} maskedCardNo クレジットカード番号を一部隠したもの
 * @returns {Promise<{ result: boolean }>} { result: true } 登録成功
 * @throws {Error} 登録に失敗した場合。カードが無効の場合はerror.messageにINVALID_CARDが入る
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const { companyId, token, maskedCardNo } = data
    const companySnapshot = await companiesCollectionRef.doc(companyId).get()
    if (!companySnapshot.exists) throw new functions.https.HttpsError('invalid-argument', 'no matched companyId')

    const { hasMemberSaved, cardSeq } = get(companySnapshot.data(), 'creditCard', {})
    if (!hasMemberSaved) {
      // GMO側に会員登録されていなかったら、カードを紐付ける前に会員情報を登録する
      const memberID = await saveMember(companyId)
      if (memberID === undefined) throw new functions.https.HttpsError('internal', 'failed to save member')
      await companySnapshot.ref.update({
        'creditCard.hasMemberSaved': true
      })
    }

    const savedCardSeq = await saveCard(companyId, token, cardSeq) // 会員情報にカードを紐付ける
      .catch(() => { throw new functions.https.HttpsError('internal', 'INVALID_CARD') })
    if (savedCardSeq === undefined) throw new functions.https.HttpsError('internal', 'failed to save card')

    await companySnapshot.ref.update({
      'creditCard.valid': true,
      'creditCard.cardSeq': savedCardSeq,
      'creditCard.maskedCardNo': maskedCardNo
    })
    return true
  })
