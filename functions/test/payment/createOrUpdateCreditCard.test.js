/* global process, describe, it, expect */
const { test } = require('../util')

const functions = require('firebase-functions')
const { NoAuthError } = require('../../src/errors')


const createOrUpdateCreditCard = require('../../src/payment/usecase/createOrUpdateCreditCard')

describe('カードの更新', () => {
  const wrapped = test.wrap(createOrUpdateCreditCard)
  const commonData = {
    companyId: process.env.TEST_MEMBER_ID,
    maskedCardNo: '4************111'
  }
  const context = { auth: { uid: 'test' } }

  it('ログインしていない場合にエラーが返る', () => {
    const data = { ...commonData, token: process.env.VALID_TOKEN }
    return expect(wrapped(data, { auth: null })).rejects.toThrow(NoAuthError())
  })

  // 決済用のダミートークンはあるが、カード情報更新には使えないため、スキップ
  it.skip('有効なカード情報が渡されたときに更新できる', async () => {
    const data = { ...commonData, token: process.env.VALID_TOKEN }
    const response = await wrapped(data, context)
    expect(response.result).toBe(false)
  })

  it('無効なカード情報が渡されたときにエラーが返る', () => {
    const data = { ...commonData, token: process.env.INVALID_TOKEN }
    return expect(wrapped(data, context)).rejects.toThrow(new functions.https.HttpsError('internal', 'INVALID_CARD'))
  })
})
