import firebase from 'firebase/app'
import mapValues from 'lodash/mapValues'
import { companiesCollectionRef, functions } from '@/plugins/firebase'

/**
 * firestoreからの返り値を受け取り、Timestamp型が混じっていたらDateに変換して返す
 * @param {Object} firestoreData firestoreから返ってきたデータ
 */
export const convertTimestampToDate = firestoreData => mapValues(firestoreData, value => value instanceof firebase.firestore.Timestamp ? value.toDate() : value)

/**
 * dataにidを追加して返却
 * @param {firebase.firestore.DocumentSnapshot} snapshot
 */
const mergeIdToDataBySnapshot = (snapshot) => {
  return { ...convertTimestampToDate(snapshot.data()), id: snapshot.id }
}

const noDocumentError = new Error('[Firestore] no document')

/**
 * @return {Promise<{id: string; selectedPlan: string; allowedPlan: string}>}
 */
export const getCompanyByUid = ({ uid }) => functions.httpsCallable('getCompanyByUid')({ uid }).then(({ data }) => data)

/**
 * @return {Promise<{id: string; selectedPlan: string; allowedPlan: string}>}
 */
export const getCompanyBySubAccountUid = async({ uid }) => functions.httpsCallable('getCompanyBySubAccountUid')({ uid }).then(({ data }) => data)

export const getSubAccountIdByUid = async({ companyId, uid }) => {
  const { companyDocumentSnapshot } = await useCompany({ companyId })
  const snap = await companyDocumentSnapshot.ref.collection('subAccounts').where('uid', '==', uid).limit(1).get()
  if (snap.empty) return { id: null }

  const [doc] = snap.docs
  return { id: doc.id }
}

export const useCompany = async({ companyId }) => {
  const companyDocumentSnapshot = await companiesCollectionRef.doc(companyId).get()
  if (!companyDocumentSnapshot.exists) throw noDocumentError

  return {
    companyDocumentSnapshot,
    companyData: mergeIdToDataBySnapshot(companyDocumentSnapshot)
  }
}

export const useSubAccount = async({ companyId, subAccountId }) => {
  const subAccountDocumentSnapshot = await companiesCollectionRef.doc(companyId).collection('subAccounts').doc(subAccountId).get()
  if (!subAccountDocumentSnapshot.exists) throw noDocumentError

  return {
    subAccountDocumentSnapshot,
    subAccountData: mergeIdToDataBySnapshot(subAccountDocumentSnapshot)
  }
}

export const useTalent = async({ companyId, talentId }) => {
  const company = await useCompany({ companyId })
  const talentDocumentSnapshot = await company.companyDocumentSnapshot.ref.collection('talents').doc(talentId).get()
  if (!talentDocumentSnapshot.exists) throw noDocumentError

  return {
    ...company,
    talentDocumentSnapshot,
    talentData: mergeIdToDataBySnapshot(talentDocumentSnapshot)
  }
}

export const useReferee = async({ companyId, talentId, refereeId }) => {
  const talent = await useTalent({ companyId, talentId })
  const refereeDocumentSnapshot = await talent.talentDocumentSnapshot.ref.collection('referees').doc(refereeId).get()
  if (!refereeDocumentSnapshot.exists) throw noDocumentError

  return {
    ...talent,
    refereeDocumentSnapshot,
    refereeData: mergeIdToDataBySnapshot(refereeDocumentSnapshot)
  }
}

// 取得系
export const getCompanies = async() => {
  const snapshot = await companiesCollectionRef.get()
  return snapshot.docs.map(doc => ({ ...convertTimestampToDate(doc.data()), id: doc.id }))
}
export const getReferees = async({ companyId, talentId }) => {
  const snapshot = await companiesCollectionRef.doc(companyId).collection('talents').doc(talentId).collection('referees').get()
  return snapshot.docs.map(doc => ({ ...convertTimestampToDate(doc.data()), id: doc.id }))
}

// 更新系
export const updateCompany = ({ companyId, data }) => companiesCollectionRef.doc(companyId).update(data)
export const updateTalent = ({ companyId, talentId, data }) => companiesCollectionRef.doc(companyId).collection('talents').doc(talentId).update(data)
export const updateTemplateQuestions = ({ companyId, templateQuestionsId, data }) => companiesCollectionRef.doc(companyId).collection('templateQuestions').doc(templateQuestionsId).update(data)
export const updateSubAccount = ({ companyId, subAccountId, data }) => companiesCollectionRef.doc(companyId).collection('subAccounts').doc(subAccountId).update(data)

// 削除
export const deleteTemplateQuestions = ({ companyId, templateQuestionsId }) => companiesCollectionRef.doc(companyId).collection('templateQuestions').doc(templateQuestionsId).delete()
