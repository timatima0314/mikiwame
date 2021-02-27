const functions = require('firebase-functions')
module.exports = {
  NoAuthError: () => new functions.https.HttpsError('internal', 'you do not have auth'),
  NoUserIdError: () => new functions.https.HttpsError('permission-denied', 'you do not have risk eyes user id')
}
