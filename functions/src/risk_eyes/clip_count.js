const functions = require('firebase-functions')
const { admin } = require('../plugins/admin')
const { companiesCollectionRef } = require('../plugins/firestore')
const apiRiskCheckRef = admin.firestore().collection('api').doc('riskCheck')
const requestRiskCheck = require('./request_riskcheck')
const get = require('lodash/get')
const { NoAuthError, NoUserIdError } = require('../errors')
const replaceToken = token => token.replace(/\//g, '\\/') // トークン内の'/'を'\/'に置換する

/**
 * RISK EYESのAPI(https://www.riskeyes.jp/countarticles_api.pdf)を利用し、キーワードにヒットした記事数を取得
 * @use functions.httpsCallable('fetchAndSaveRiskCheck')({
 *        companyId: <companyドキュメントのid>,
 *        talentId: <talentドキュメントのid>,
 *      })
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const { companyId, talentId } = data
    const companyDoc = await companiesCollectionRef.doc(companyId).get()
    const enduserid = companyDoc.data().riskEyesId
    if (!enduserid) throw NoUserIdError()

    const talentDocumentRef = companiesCollectionRef.doc(companyId).collection('talents').doc(talentId)
    const talentDoc = await talentDocumentRef.get()
    const talentName = talentDoc.data().name
    const apiRiskCheckDoc = await apiRiskCheckRef.get()
    const _token = apiRiskCheckDoc.data().token
    const _refreshToken = apiRiskCheckDoc.data().refreshToken
    const [token, refreshToken] = (!_token || !_refreshToken)
      ? await getNewToken() // DBにトークン情報がなかった場合、新たに取得
      : [_token, _refreshToken]
    const [paperClipCount, webClipCount] = await getClipCount(token, talentName, enduserid)
      .catch(async () => {
        // tokenの期限が切れている場合、getClipCountにエラーが発生
        console.log('Token is expired')
        const newToken = await updateToken(refreshToken)
        return await getClipCount(newToken, talentName, enduserid)
      })
    await Promise.all([
      talentDocumentRef.set({
        riskCheck: {
          paperClipCount,
          webClipCount
        }
      }, { merge: true }),
      companiesCollectionRef.doc(companyId).update({
        clipNumApiCalledCount: admin.firestore.FieldValue.increment(1)
      })
    ])
    return { paperClipCount, webClipCount }
  })

/**
* 新しいtokenとrefresh tokenを取得し、DBに保存する
*/
async function getNewToken() {
  const tokenData = {
    _username: functions.config().risk_eyes.username,
    _password: functions.config().risk_eyes.password
  }
  const tokenResponse = await requestRiskCheck('login_check', tokenData)
  const { token, refresh_token } = tokenResponse.data
  console.log('Got token')
  const newToken = replaceToken(token)
  apiRiskCheckRef.set({
    token: newToken,
    refreshToken: refresh_token
  }, { merge: true })
  return [newToken, refresh_token]
}

/**
* 紙媒体と電子媒体の記事数を取得し、DBに保存する
*
* @param {string} token 取得したRISK EYES APIのtoken
* @param {string} talentName 記事の検索対象となる候補者の氏名
*/
async function getClipCount(token, talentName, enduserid) {
  const requestData = {
    keyword: talentName,
    negative_type: 0,
    enduserid
  }
  const paperRequest = requestRiskCheck('search/paper/count', requestData, token)
  const webRequest = requestRiskCheck('search/web/count', requestData, token)
  const [paperResponse, webResponse] = await Promise.all([paperRequest, webRequest])
  return [paperResponse.data.clip_count, webResponse.data.clip_count]
}

/**
* tokenまたはrefreshTokenの期限が切れている場合、更新する
*
* @param {string} refreshToken 取得したRISK EYES APIのrefreshToken
*/
async function updateToken(refreshToken) {
  const refreshTokenResponse = await requestRiskCheck('token/refresh', { refresh_token: refreshToken })
  if (refreshTokenResponse.data.token) {
    // tokenの更新が成功した場合
    const newToken = replaceToken(refreshTokenResponse.data.token)
    await apiRiskCheckRef.set({
      token: newToken
    }, { merge: true })
    return newToken
  } else if (get(refreshTokenResponse.data, 'errors.error_code') === 'E400006') {
    // refreshTokenの期限も切れている場合、エラーコードE400006が返ってくる
    console.log('Refresh Token is expired')
    const [newToken] = await getNewToken()
    return newToken
  }
}
