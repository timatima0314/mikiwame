const functions = require('firebase-functions')
const requestRiskCheck = require('./request_riskcheck')
const { NoAuthError } = require('../errors')
const get = require('lodash/get')

module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .https
  .onCall(async (data, context) => {
    if (data.awakeRun) return null
    if (context.auth === null) throw NoAuthError()

    const { talentName } = data
    const response = await requestRiskCheck('token/access', { access_key: functions.config().risk_eyes.access_key })
    const accessToken = get(response.data, 'token')
    const encodedUrl = `https://www.riskeyes.jp/mypage/requestUrl?keyword=${encodeURI(talentName)}&negative_type=0&paper_flg=1&web_flg=1&access_token=${accessToken}`
    return { resultUrl: encodedUrl }
  })
