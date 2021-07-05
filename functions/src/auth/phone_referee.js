const functions = require('firebase-functions')
const { admin } = require('../plugins/admin')
const { NoAuthError } = require('../errors')

/*
メールアドレスのないユーザーはすべてreferee用アカウント。
referee用アカウントとして登録されているだけならOKということにする。つまりメールアドレスも登録されているなら弾く。
なぜかというと通信エラー等でfirestoreでのrefereeとしての電話番号登録が完了していないにもかかわらずauthで登録されていてスタックする問い合わせが多発したため。
*/
module.exports = functions
  .region('asia-northeast1')
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    try {
      const user = await admin.auth().getUserByPhoneNumber(data.phoneNumber)
      return { registered: Boolean(user && user.email) }
    } catch (err) {
      if (err.code === 'auth/user-not-found') return { registered: false }

      throw new functions.https.HttpsError('internal', 'error')
    }
  })
