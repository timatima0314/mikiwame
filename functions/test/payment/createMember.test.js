require('dotenv').config()
const { saveMember, saveCard, generateRandomString } = require('../../src/payment/util')

/* global process, describe, it */
// TODO: まだ途中
describe.skip('会員の登録とカードの紐付け', () => {
  // @CAUTION 一度削除した会員IDは使い回せない。そのため、テストケースで会員登録を走らせすぎると会員IDが枯渇する可能性がある
  // TODO: master反映のときだけ実際に会員登録してテストする
  const generateMemberID = () => {
    const idPrefix = process.env.NODE_ENV === 'test' ? 'test' : 'prod'
    const maxLengthOfMemberId = 60 // クレカAPI(GMO payment gateway)のドキュメントを参照
    const hashLength = maxLengthOfMemberId - idPrefix.length - 1 // ハイフンの1文字分短くなる
    const hash = generateRandomString(hashLength)
    const memberID = `${idPrefix}-${hash}`
    return memberID
  }
  const memberID = generateMemberID()
  console.log({ memberID })

  it('GMO側に会員登録できる', async() => {
    const savedMemberID = await saveMember(memberID).catch(err => {
      console.error(err.response.data)
      // 確率的にはほぼありえないが、万が一すでに登録されている会員IDが乱数によって生成された場合、1度だけリトライする
      // if (err.response.data.errInfo === ERROR_CODE.ALREADY_REGISTERD) {
      //   memberID = generateMemberID()
      //   return saveMember(memberID)
      // }
    })
    assert.equal(savedMemberID, memberID)
  })

  // カードの削除は9999回の制限があるため、テストケースで走らせすぎると制限に達する可能性がある。
  it('先程登録した会員にカードを紐付けられる', async() => {
    const dummyVisaCardNo = '4111111111111111'
    const dummyExpire = '2204' // 2022/04
    const sucessed = await saveCard(memberID, dummyVisaCardNo, dummyExpire)
    assert.equal(sucessed, true)
  })
})
