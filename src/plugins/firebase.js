import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
import { collectionVersions } from '../../firestore_version'

if (firebase.apps.length === 0) {
  firebase.initializeApp(JSON.parse(process.env.VUE_APP_FIREBASE_CONFIG))

  if (process.env.VUE_APP_USE_FIRESTORE_EMULATOR) {
    firebase.firestore().settings({
      host: 'localhost:8080',
      ssl: false
    })
  }
}

// functionsの実行リージョンを東京に設定する
const functions = firebase.app().functions('asia-northeast1')
if (process.env.VUE_APP_FUNCTIONS_EMULATOR_PORT) {
  functions.useFunctionsEmulator(`http://localhost:${process.env.VUE_APP_FUNCTIONS_EMULATOR_PORT}`)
}
export { functions }

export const companiesCollectionRef = firebase
  .firestore()
  .collection(`company_version/${collectionVersions.companies}/companies`)

export const adminConfigsRef = firebase
  .firestore()
  .doc('admin_configs/1')

export const companiesStorageRef = firebase
  .storage()
  .ref()
  .child('identification/companies')

export const getRiskEyesBillingRefByYYYYMM = YYYYMM => firebase.firestore().doc(`risk_eyes_billing/${YYYYMM}`)

export const getCurrentUser = () => new Promise((resolve, reject) => {
  const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
    unsubscribe()
    resolve(user)
  }, reject)
})

export const withdrawalQuestionnairesRef = firebase
  .firestore()
  .collection('withdrawal_questionnaire')
