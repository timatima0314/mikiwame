const { admin } = require('./utils/admin')
/**
 * ログインカウントの追加
 * 0から1へ変わる際に初回ログインポップアップが出るため、既存のデータは1に初期化
 * @see https://firebase.google.com/docs/admin/setup?hl=ja
 * @run
 * ```
 * $ export GOOGLE_APPLICATION_CREDENTIALS='path/to/credentisl.json'
 * $ node add_logincount_to_companies.js
 * ```
 */

const main = async() => {
    admin.firestore().doc('/company_version/1/').collection('companies').get().then(companiesSnapshot => {
        companiesSnapshot.forEach(companyDoc => {
            companyDoc.ref.update({
                loginCount: 1
            })
        })
    })
}

main()
