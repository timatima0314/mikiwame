const functions = require('firebase-functions')
const { admin } = require('../plugins/admin')
const { companiesCollectionRef } = require('../plugins/firestore')
const pick = require('lodash/pick')
const { NoAuthError } = require('../errors')

/**
 * companyドキュメントの中で、返却するフィールド
 * (companyドキュメントには機密データも含まれるので、すべてのフィールドを返すのは危険)
 */
const companyResponseFields = ['selectedPlan', 'allowedPlan']

// メインアカウント関連
/**
* uid から、ユーザーが属する company の id, plan を返す
* @param {string} uid Firebase Auth のuid
* @return {firebase.firestore.DocumentData & { id:string }} companyData companyドキュメントのデータ
*/
exports.getCompanyByMainUid = functions
  .region('asia-northeast1')
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const snap = await companiesCollectionRef.where('uid', '==', data.uid).limit(1).get()
    if (snap.empty) return { id: null }

    const [doc] = snap.docs
    return { ...pick(doc.data(), companyResponseFields), id: doc.id }
  })

// サブアカウント関連
/**
 * companyのsubAccountUidsにサブアカウントのuidを追加
 * @param {string} companyId
 * @param {string} uid
 */
exports.pushSubUid = functions
  .region('asia-northeast1')
  .https
  .onCall(async ({ companyId, uid, awakeRun }) => {
    if (awakeRun) return null

    return companiesCollectionRef.doc(companyId).update({
      subAccountUids: admin.firestore.FieldValue.arrayUnion(uid)
    })
  })

/**
 * companyのsubAccountUidsからサブアカウントのuidを削除
 * @param {string} companyId
 * @param {string} uid
 */
exports.deleteSubUid = functions
  .region('asia-northeast1')
  .https
  .onCall(async ({ companyId, uid, awakeRun }) => {
    if (awakeRun) return null

    return companiesCollectionRef.doc(companyId).update({
      subAccountUids: admin.firestore.FieldValue.arrayRemove(uid)
    })
  })

/**
 * サブアカウントのuid から、サブアカウントが属する company のデータを返す
 * @param {string} uid Firebase Auth のuid
 * @return {firebase.firestore.DocumentData & { id:string }} companyData companyドキュメントのデータ
 */
exports.getCompanyBySubUid = functions
  .region('asia-northeast1')
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const snap = await companiesCollectionRef.where('subAccountUids', 'array-contains', data.uid).get()
    if (snap.empty) return { id: null }

    const [doc] = snap.docs
    return { ...pick(doc.data(), companyResponseFields), id: doc.id }
  })

// subAccountドキュメントの更新を許可するフィールド
const ALLOWED_FIELDS = ['uid', 'email']
/**
 * サブアカウント登録時に呼び出し
 * uidとemailの更新に使用
 */
exports.updateSub = functions
  .region('asia-northeast1')
  .https
  .onCall(async ({ companyId, subAccountId, data, awakeRun }) => {
    if (awakeRun) return null

    const subAccountDocumentRef = companiesCollectionRef.doc(companyId).collection('subAccounts').doc(subAccountId)
    return subAccountDocumentRef.update(pick(data, ALLOWED_FIELDS))
  })
