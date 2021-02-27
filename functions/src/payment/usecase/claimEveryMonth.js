const functions = require('firebase-functions')
const { companiesCollectionRef } = require('../../plugins/firestore')
const { executeTransaction, entryTransaction } = require('../util')
const get = require('lodash/get')
const dayjs = require('dayjs')

/**
 * 未使用：洗替・継続課金CSVを毎月アップロードする方式を採用しているため。自動課金したい要望がでてくるのに備えて残しておく
 * 定期的に請求を行う関数。
 * 前提として、1ヶ月前に取引を登録し、クレカの限度額を確保しておき、その1ヶ月後に請求を行うことを想定
 *
 * @returns {boolean>} 成功したらtrueが返却される
 */
exports.main = functions
  .region('asia-northeast1') // 東京リージョン
  .pubsub
  .schedule('every 1 day')
  .onRun(async() => {
    const companiesSnapshot = await companiesCollectionRef.get()
    companiesSnapshot.forEach(doc => claimByCompanyDocumentSnapshot(doc).catch(console.error)) // エラーを吐いても途中で請求処理が中断しないようにcatchしておく

    return true
  })

/**
 * それぞれのcompanyに対して、条件を満たしていれば請求を行う
 *         ・・・
 * 請求を行わない条件
 * noClaimCond 1. 解約済み
 * noClaimCond 2. すでに請求済み
 * noClaimCond 3. 請求日より前
 *
 * 上記条件に当てはまらない場合、以下の2つの処理を行う
 * proc 1. 直近1ヶ月分の請求
 * proc 2. proc1が成功したら、1ヶ月後の請求のための取引登録
 *
 * @param {firebase.firestore.DocumentSnapshot} companyDocumentSnapshot
 * @returns {Promise<boolean>} 成功したらtrueが返却される
 */
async function claimByCompanyDocumentSnapshot(companyDocumentSnapshot) {
  const { canceledAt } = companyDocumentSnapshot.data()
  if (canceledAt) return // noClaimCond 1. 解約済みだったら何もしない

  const orderCollection = companyDocumentSnapshot.ref.collection('orders')
  const [lastOrderSnapshot] = (await orderCollection.orderBy('createdAt', 'desc').limit(1).get()).docs
  const { doneAt, createdAt } = lastOrderSnapshot.data()
  if (doneAt) return // noClaimCond 2. 請求済みだったら、何もしない

  const willClaimDate = dayjs(createdAt.toDate()).add('1', 'month').toDate() // createdAt + 1monthで請求日を計算
  if (dayjs().isBefore(willClaimDate, 'day')) return // noClaimCond 3. 請求日よりも前だったら、何もしない


  // proc 1. 直近1ヶ月分の請求を行う
  const cardSeq = get(companyDocumentSnapshot.data(), 'creditCard.cardSeq')
  if (cardSeq === undefined) {
    console.error('no cardSeq in companyDocument.creditCard.cardSeq')
    return false
  }

  const { accessID, accessPass } = lastOrderSnapshot.data()
  // TODO: 従量課金APIの使用回数に応じて金額変更処理
  const result = await executeTransaction(accessID, accessPass, lastOrderSnapshot.id, cardSeq).catch(console.error)
  if (!result) {
    console.error('failed to executeTransaction')
    return false
  }
  await lastOrderSnapshot.ref.update({ doneAt: new Date() })

  // proc 2. 1ヶ月後の請求のための取引登録
  const orderRef = await orderCollection.add({ createdAt: new Date() })
  const { accessID: futureAccessID, accessPass:futureAccessPass } = await entryTransaction(orderRef.id)
  await orderRef.update({ accessID: futureAccessID, accessPass: futureAccessPass })

  return true
}

exports.claimByCompanyDocumentSnapshot = claimByCompanyDocumentSnapshot

