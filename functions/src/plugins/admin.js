const admin = require('firebase-admin')
admin.initializeApp()

module.exports = {
  admin,
  bucket: admin.storage().bucket()
}
