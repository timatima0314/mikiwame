const functions = require('firebase-functions')
const { admin } = require('../plugins/admin')
const { NoAuthError } = require('../errors')

module.exports = functions
  .region('asia-northeast1')
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const globalizeNumber = tel => `+81${tel.slice(1)}`
    try {
      const user = await admin.auth().getUserByPhoneNumber(globalizeNumber(data.phoneNumber))
      return { registered: Boolean(user) }
    } catch (err) {
      if (err.code === 'auth/user-not-found') return { registered: false }

      throw new functions.https.HttpsError('internal', 'error')
    }
  })
