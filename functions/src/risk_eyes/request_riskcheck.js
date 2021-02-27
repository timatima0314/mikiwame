const axios = require('axios').default

/**
* APIにリクエストを送信する
*
* @param {string} endpoint リクエストの送信先
* @param {object} data APIに送信するデータ
* @param {string} token 取得したRISK EYES APIのtoken
* @example const response = await requestRiskCheck('search/paper/count', { keyword: talentName, negative_type: 0 }, token)
*/
module.exports = function requestRiskCheck(endpoint, data, token = null) {
  return axios({
    method: 'post',
    url: `https://www.riskeyes.jp/api/${endpoint}`,
    data,
    headers: {
      'Content-Type': 'application/json',
      ...(token === null ? {} : { Authorization: `Bearer ${token}` })
    }
  })
}
