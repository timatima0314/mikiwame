/* global process, describe, beforeAll, beforeEach, it, expect */
require('../util')
const { companiesCollectionRef } = require('../../src/plugins/firestore')
const { claimByCompanyDocumentSnapshot } = require('../../src/payment/usecase/claimEveryMonth')
const FieldValue = require('firebase-admin').firestore.FieldValue
const dayjs = require('dayjs')
const { entryTransaction } = require('../../src/payment/util')

describe.skip('決済処理', () => {
  let companyDocumentRef, lastOrderSnapshot
  beforeAll(async() => {
    companyDocumentRef = companiesCollectionRef.doc(process.env.TEST_MEMBER_ID)
    lastOrderSnapshot = (await companyDocumentRef.collection('orders').orderBy('createdAt', 'desc').limit(1).get()).docs[0]
    if (lastOrderSnapshot.data().accessID === undefined) {
      // GMO側に取引を登録していなかったら
      console.log('init GMO tran')
      const { accessID, accessPass } = await entryTransaction(lastOrderSnapshot.id)
      await lastOrderSnapshot.ref.update({ accessID, accessPass })
      lastOrderSnapshot = await lastOrderSnapshot.ref.get() // 再取得
    }
  })

  beforeEach(async() => {
    await companyDocumentRef.update({ canceledAt: FieldValue.delete() })
    await lastOrderSnapshot.ref.update({ doneAt: FieldValue.delete() })
  })

  it('解約済みの会社に対して請求処理が走らない', async () => {
    await companyDocumentRef.update({ canceledAt: new Date() })
    const canceledCompanySnapshot = await companyDocumentRef.get()

    const result = await claimByCompanyDocumentSnapshot(canceledCompanySnapshot)
    expect(result).toBeUndefined()

    lastOrderSnapshot = await lastOrderSnapshot.ref.get() // 再取得
    expect(lastOrderSnapshot.data().doneAt).toBeUndefined()
  })

  it('請求済みの会社に対して請求処理が走らない', async() => {
    await lastOrderSnapshot.ref.update({ doneAt: new Date() })
    lastOrderSnapshot = await lastOrderSnapshot.ref.get() // 再取得

    const companySnapshot = await companyDocumentRef.get()
    const result = await claimByCompanyDocumentSnapshot(companySnapshot)
    expect(result).toBeUndefined()
  })

  it('1日前に登録された取引に対して請求処理が走らない', async() => {
    await lastOrderSnapshot.ref.update({ createdAt: dayjs().add(-1, 'day').toDate() })

    const companySnapshot = await companyDocumentRef.get()
    const result = await claimByCompanyDocumentSnapshot(companySnapshot)
    expect(result).toBeUndefined()
  })

  // TODO: テストカードで決済ができない
  it.skip('一ヶ月前に登録された取引に対して請求処理が走る', async() => {
    await lastOrderSnapshot.ref.update({ createdAt: dayjs().add(-1, 'month').toDate() })
    lastOrderSnapshot = await lastOrderSnapshot.ref.get()

    const companySnapshot = await companyDocumentRef.get()
    const result = await claimByCompanyDocumentSnapshot(companySnapshot)
    expect(result).toBe(true)

    expect(lastOrderSnapshot.data().doneAt).not.toBeUndefined()
  })
})
