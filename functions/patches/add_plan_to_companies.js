const { admin } = require('./utils/admin')
/**
 * ログイン時にプランを選択するように変更になったので、それ以前に登録した会社にselectedPlanとallowedPlanを追加
 * @see https://firebase.google.com/docs/admin/setup?hl=ja
 * @run
 * ```
 * $ export GOOGLE_APPLICATION_CREDENTIALS='path/to/credentisl.json'
 * $ node add_plan_to_companies.js
 * ```
 */

const main = async() => {
  
  admin.firestore().doc('/company_version/1/').collection('companies').get().then(companiesSnapshot => {
    companiesSnapshot.forEach(companyDoc => {
      companyDoc.ref.update({
        selectedPlan: 'LIGHT',
        allowedPlan: 'LIGHT'
      })
    })
  })
}

main()
