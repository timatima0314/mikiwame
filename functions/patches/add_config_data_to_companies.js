const { admin } = require('./utils/admin')
/**
 * 設定画面の名刺取得設定とフリーメール許可設定にデフォルト値(名刺はデフォルトで取得、フリーメールは許可しない)を追加
 * @see https://firebase.google.com/docs/admin/setup?hl=ja
 * @run
 * ```
 * $ export GOOGLE_APPLICATION_CREDENTIALS='path/to/credentisl.json'
 * $ node add_config_data_to_companies.js
 * ```
 */

const main = async () => {

  admin.firestore().doc('/company_version/1/').collection('companies').get().then(companiesSnapshot => {
    companiesSnapshot.forEach(companyDoc => {
      const { isBusinessCardRequired, isFreemailAllowed } = companyDoc.data()
      if (typeof isBusinessCardRequired === 'boolean' && typeof isFreemailAllowed === 'boolean') return

      companyDoc.ref.update({
        isBusinessCardRequired: true,
        isFreemailAllowed: false
      })
    })
  })
}

main()
