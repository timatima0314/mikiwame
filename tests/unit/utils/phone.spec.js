import { formatPhoneNumber, normalizePhoneNumber, anonymizePhoneNumber  } from '@/utils/phone.js'

describe('Utils:phone', () => {
  const japanesePhoneNumber = '09012341234'
  const globalPhoneNumber = '+819012341234'
  const anonymousPhoneNumber = '090-****-**34'

  it('test format phone number', () => {
    expect(formatPhoneNumber(japanesePhoneNumber)).toBe(globalPhoneNumber)
  })

  it('test normalize phone number', () => {
    expect(normalizePhoneNumber(globalPhoneNumber)).toBe(japanesePhoneNumber)
  })

  it('test anonymize phone number', () => {
    expect(anonymizePhoneNumber(japanesePhoneNumber)).toBe(anonymousPhoneNumber)
  })
})
