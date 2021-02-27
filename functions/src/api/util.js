const { companiesCollectionRef } = require('../plugins/firestore')

/**
 * 
 * @param {string} companyId
 * @param {string} talentId
 * @return {firebase.firestore.DocumentReference}
 */
exports.getTalentDocumentRefByIds = (companyId, talentId) => companiesCollectionRef.doc(companyId).collection('talents').doc(talentId)
