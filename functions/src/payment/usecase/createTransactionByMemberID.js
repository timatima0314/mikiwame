const functions = require('firebase-functions')
const { companiesCollectionRef } = require('../plugins/firebase')
const { entryTransaction } = require('../util')
const { NoAuthError } = require('../../errors')
/**
 * 未使用：洗替・継続課金CSVを毎月アップロードする方式を採用しているため。自動課金したい要望がでてくるのに備えて残しておく
 * createTransactionByMemberID
 * 指定した会員を対象に取引を登録する。請求は発生しないが、クレカの限度額を抑えた状態にする。
 * @param {string} memberID GMO側に登録した会員情報のID。companyIdを用いる
 * @param {number} amount 請求金額
 * @returns {Promise<{ result: true }>} 成功したらtrueが返却される
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .https
  .onCall(async(data, context) => {
    if (context.auth === null) throw NoAuthError()

    const { memberID, amount } = data
    const addedOrderDocumentRef = await companiesCollectionRef.doc(memberID).collection('orders').add({
      amount,
      createdAt: new Date()
    })

    const { accessID, accessPass } = await entryTransaction(addedOrderDocumentRef.id, amount)
    await addedOrderDocumentRef.update({ accessID, accessPass })

    return true
  })
