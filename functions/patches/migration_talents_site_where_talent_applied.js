const { admin } = require('./utils/admin')
/**
 *
 * ```
 * $ export GOOGLE_APPLICATION_CREDENTIALS='path/to/credentisl.json'
 * $ node add_email_to_company.js
 * ```
 */

const main = async() => {

  const companiesSnapshot = await admin.firestore().doc('/company_version/1/').collection('companies').get()
  companiesSnapshot.forEach(async companyDoc => {
    const talentsSnapshot = await companyDoc.ref.collection('talents').get()
    talentsSnapshot.forEach(async talentDoc => {
      const data = talentDoc.data()
      if(typeof data.siteWhereTalentApplied === 'string'){
        const arraySiteWhereTalentApplied = [data.siteWhereTalentApplied]
        data.siteWhereTalentApplied = arraySiteWhereTalentApplied
        await talentDoc.ref.update(data)
      }
    })
  })
}

main()
