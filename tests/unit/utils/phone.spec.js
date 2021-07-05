import { formatPhoneNumber, normalizePhoneNumber, anonymizePhoneNumber } from '@/utils/phone.js'

describe('Utils:phone', () => {
  const japanesePhoneNumber = '09012341234'
  const globalPhoneNumber = '+819012341234'

  it('test format phone number', () => {
    expect(formatPhoneNumber(japanesePhoneNumber)).toBe(globalPhoneNumber)
  })

  it('test normalize phone number', () => {
    expect(normalizePhoneNumber(globalPhoneNumber)).toBe(japanesePhoneNumber)
  })

  it('test anonymize phone number', () => {
    const jp = {
      phoneNumber: '+819012341234',
      expected: '+8190******34'
    }
    const sg = {
      phoneNumber: '+6561234567',
      expected: '+6561****67'
    }
    expect(anonymizePhoneNumber(jp.phoneNumber)).toBe(jp.expected)
    expect(anonymizePhoneNumber(sg.phoneNumber)).toBe(sg.expected)
  })
})
