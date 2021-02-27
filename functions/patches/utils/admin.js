const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: `https://${process.env.FIREBASE_PROJECT}.firebaseio.com`
})
exports.admin = admin
