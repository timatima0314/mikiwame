const { admin } = require('./utils/admin')
/**
 * 
 * @see https://firebase.google.com/docs/admin/setup?hl=ja
 * @run
 * ```
 * $ export GOOGLE_APPLICATION_CREDENTIALS='path/to/credentisl.json'
 * $ export FIREBASE_PROJECT='mikiwame-prod' # or 'mikiwame-dev'
 * $ node delete_all_users.js
 * ```
 */

const main = async() => {
  const { users } = await admin.auth().listUsers()
  for (const user of users) {
    console.log(user.uid)
    await admin.auth().deleteUser(user.uid)
  } 
}

main()
