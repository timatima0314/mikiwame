const functions = require('firebase-functions')
const { admin } = require('../plugins/admin')
const { NoAuthError } = require('../errors')

/**
 * firebaes authのカスタムクレームに{ admin: true }を追加する
 * cf) https://firebase.google.com/docs/auth/admin/custom-claims?hl=ja
 *
 * @use functions.httpsCallable('setAdminRoleByUid')({ uid: <uid> })
 */
module.exports = functions
  .region('asia-northeast1')
  .https
  .onCall(async(data, context) => {
    if (context.auth === null) throw NoAuthError()

    await admin.auth().setCustomUserClaims(data.uid, { admin: true })
    return null
  })
