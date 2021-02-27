// GMOエンドポイントへのリクエストをラップした関数たちの置き場所
const functions = require('firebase-functions')
const axios = require('axios').default
const get = require('lodash/get')
const pickBy = require('lodash/pickBy')
const { ERROR_CODE } = require('./errorCode')
const { DEFAULT_MONTHLY_PRICE } = require('../constants/constants')

/**
 * カード情報を紐付けるためにGMO側に会員を登録する
 * @param {string} memberID こちらが自由に設定できる
 * @param {string} memberName 会員の名前
 * @returns {Promise<string>} memberID
 */
exports.saveMember = async function(memberID, memberName) {
  const response = await requestPaymentProvider('SaveMember.json', { memberID, memberName })
    .catch(err => {
      showErrorResponseData(err)
      if (err.response.data[0].errInfo === ERROR_CODE.ALREADY_REGISTERD) {
        return { data: { memberID } } // すでに登録されているエラーをキャッチした場合も処理を続けられるように
      }
    })
  return response.data.memberID
}

/**
 * GMO側にカードを保存し、会員と紐付ける
 * @param {string} memberID GMO側に登録した会員情報のID
 * @param {string} token クレジットカード情報をトークン化したもの
 * @param {number | null} cardSeq GMO側に登録しているクレジットカードの連番。更新時のみ必要
 * @returns {Promise<number>} クレジットカードの連番
 * @throws {Error} カードが無効な場合
 */
exports.saveCard = async function(memberID, token, cardSeq = null) {
  const response = await requestPaymentProvider('SaveCard.json', pickBy({
    memberID, token, cardSeq,
    defaultFlag: 1 // 継続課金対象にする
  })).catch(err => {
    showErrorResponseData(err)
    if (err.response.data[0].errInfo === ERROR_CODE.INVALID_CARD) {
      throw Error('invalid card')
    }
  })
  return Number(response.data.cardSeq)
}

/**
 * GMO側に登録したカードの連番を取得する
 * @param {string} memberID GMO側に登録した会員情報のID
 * @returns {string} cardSeq e.g. '0001'
 */
exports.searchCard = async function(memberID) {
  const response = await requestPaymentProvider('SearchCard.json', { memberID })
  return response.data.cardSeq
}

/**
 * 自動売上を登録する
 * @param {string} memberID GMO側に登録した会員情報のID
 * @param {string} recurringID GMO側に登録する自動売上ID。自由に指定できるため、firestoreのドキュメントIDを指定
 * @param {number} amount 課金金額
 * @param {number} chargeDay 毎月の課金日
 */
exports.registerRecurringCredit = async function(memberID, recurringID, amount, chargeDay) {
  const response = await requestPaymentProvider('RegisterRecurringCredit.json', {
    memberID, recurringID, amount, chargeDay,
    registType: 1 // 会員IDを指定する
  }).catch(showErrorResponseData)
  return response
}

/**
 * 取引を登録する
 * @param {string} orderId こちらが任意に指定できる
 * @param {number} amount 金額
 * @returns {Promise<{ accessID: string, accessPass: string }>}
 */
exports.entryTransaction = async function(orderID, amount = DEFAULT_MONTHLY_PRICE) {
  const response = await requestPaymentProvider('EntryTran.json', {
    orderID,
    amount,
    // AUTH: 仮売上。クレカの限度額を抑えているが請求はしていない状態
    jobCd: 'AUTH'
  }).catch(showErrorResponseData)

  const { accessID, accessPass } = response.data
  return { accessID, accessPass }
}

/**
 * 決済する
 * @param {string} accessID
 * @param {string} accessPass
 * @param {string} orderId
 * @param {string} cardSeq GMOに登録したカードの連番 e.g. '0001'
 */
exports.executeTransaction = async function(accessID, accessPass, orderID, cardSeq) {
  const response = await requestPaymentProvider('ExecTran.json', {
    accessID, accessPass, orderID, cardSeq,
    method: 1
  }).catch(showErrorResponseData)
  return response
}

/**
 * @param {string} memberID 削除したい会員のID
 * @returns {Promise<boolean>} 成功/失敗
 */
exports.deleteMember = async function(memberID) {
  const response = await requestPaymentProvider('DeleteMember.json', { memberID }).catch(showErrorResponseData)
  return existsErrorCodeInResponse(response)
}

/**
 * @param {string} endpoint e.g. EntryTran.json 先頭にスラッシュはいらない
 * @param {{ [key: string]: string | number }} data リクエストボディ
 * @returns {Promise<any>}
 */
function requestPaymentProvider(endpoint, data) {
  const requestBody = {
    ...data,
    siteID: functions.config().payment.site_id,
    sitePass: functions.config().payment.site_pass,
    shopID: functions.config().payment.shop_id,
    shopPass: functions.config().payment.shop_pass
  }
  return axios.post(`${functions.config().payment.base_url}/${endpoint}`, requestBody, {
    'Content-Type': 'application/json;charset=UTF-8'
  })
}

/**
 * @param {{ data: any }} response
 * @returns {boolean}
 */
function existsErrorCodeInResponse(response) {
  return get(response, 'data.errCode') !== undefined
}

/**
 * @param {{ response: { data: any } }} err
 */
function showErrorResponseData(err) {
  console.log(err.response.data)
}


// TODO: delete
const { randomBytes } = require('crypto')
/**
 * 与えられた長さのランダムな文字列を生成する
 * @param {number} length
 * @see htps://qiita.com/suin/items/b60b0cd1dffd66d79e71t
 */
exports.generateRandomString = function(length) {
  return randomBytes(length).reduce((p, i) => p + (i % 32).toString(32), '')
}
