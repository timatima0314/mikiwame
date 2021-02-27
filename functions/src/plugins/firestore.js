const { admin } = require('./admin')
const { collectionVersions } = require('../../version')

module.exports = {
  companiesCollectionRef: admin.firestore().collection(`company_version/${collectionVersions.companies}/companies`),
  adminConfigRef: admin.firestore().doc('admin_configs/1'),
  withdrawalQuestionnaireRef: admin.firestore().collection('withdrawal_questionnaire')
}
