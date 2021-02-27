const functions = require('firebase-functions')
const { admin } = require('../plugins/admin')
const { companiesCollectionRef } = require('../plugins/firestore')
const { NoAuthError } = require('../errors')

/**
 * Authユーザーの有効/無効を切り替える
 * @param {string} companyId companyドキュメントのid
 * @param {boolean} disabledValue trueで無効，falseで有効
 * @param {string} subAccountUid subAccountのuid
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const { disabledValue, companyId, subAccountUid } = data
    // サブアカウントを個別で無効にする場合
    if (subAccountUid) return admin.auth().updateUser(subAccountUid, { disabled: disabledValue })

    const companySnapshot = await companiesCollectionRef.doc(companyId).get()
    const { uid } = companySnapshot.data()
    const subAccountUids = companySnapshot.data().subAccountUids || []
    // メインアカウントが退会する場合、サブアカウントもまとめて無効に
    await Promise.all(
      [uid, ...subAccountUids].map(uid => admin.auth().updateUser(uid, { disabled: disabledValue }))
    )
  })
