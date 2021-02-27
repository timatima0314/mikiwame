const { admin } = require('./utils/admin')
/**
 * 1. 退会後に復活依頼が来たときに本人確認したい
 * 2. 管理者画面からメアドで検索できるようにしたい
 * 以上の理由より company ドキュメントにemailを追加する
 * @see https://firebase.google.com/docs/admin/setup?hl=ja
 * @run
 * ```
 * $ export GOOGLE_APPLICATION_CREDENTIALS='path/to/credentisl.json'
 * $ node add_email_to_company.js
 * ```
 */

const main = async() => (
  admin.firestore().doc('/company_version/1/').collection('companies').get().then(companiesSnapshot => {
    companiesSnapshot.forEach(async companyDoc => {
      const { uid } = companyDoc.data()
      console.log({ uid })
      const user = await admin.auth().getUser(uid).catch(() => {})
      if (user == null) return

      console.log(user.email)
      return companyDoc.ref.update({
        email: user.email
      })
    })
  })
)

main()
