const { admin } = require('./utils/admin')
/**
 * 候補者のステータスを追加
 * talentRegistered(メール未開封)→agreeToPrivacyPolicy(推薦者未登録)→refereesRegistered(推薦者未回答)→refereesAnswered(完了)の4段階

 * 2020/12/02 追記
 * talentRegistered(メール未送信)→mailSend(メール未開封)→agreeToPrivacyPolicy(推薦者未登録)→refereesRegistered(推薦者未回答)→refereesAnswered(完了)
 * の5段階へ仕様変更(バッチ処理は未実行)

 * @see https://firebase.google.com/docs/admin/setup?hl=ja
 * @run
 * ```
 * $ export GOOGLE_APPLICATION_CREDENTIALS='path/to/credential.json'
 * $ node add_status_to_talents.js
 * ```
 */
const statusEnum = {
  talentRegistered: 'talentRegistered',
  agreeToPrivacyPolicy: 'agreeToPrivacyPolicy',
  refereesRegistered: 'refereesRegistered',
  refereesAnswered: 'refereesAnswered'
}
const main = async () => {

  const companiesSnapshot = await admin.firestore().doc('/company_version/1/').collection('companies').get()
  companiesSnapshot.forEach(async companyDoc => {
    const talentsSnapshot = await companyDoc.ref.collection('talents').get()
    talentsSnapshot.forEach(async talentDoc => {
      if (talentDoc.data().status) return

      const refereesSnapshot = await talentDoc.ref.collection('referees').get()
      const haveAnswered = refereesSnapshot.docs.some(referee => referee.data().answer !== undefined)
      if (haveAnswered) return talentDoc.ref.update({
        status: statusEnum.refereesAnswered
      })
      else if (refereesSnapshot.docs.length) return talentDoc.ref.update({
        status: statusEnum.refereesRegistered
      })
      else if (talentDoc.data().isAgreeToPrivacyPolicy) return talentDoc.ref.update({
        status: statusEnum.agreeToPrivacyPolicy
      })
      else return talentDoc.ref.update({
        status: statusEnum.talentRegistered
      })
    })
  })
}

main()
