/**
 * 日本の国番号
 */
export const JP_CODE = '+81'

/**
 * 携帯番号を+81から始まる番号に変換する
 * e.g. 09011111111 -> +819011111111
 * @param {string} tel ハイフン無しの電話番号
 */
export function formatPhoneNumber(tel) {
  return `${JP_CODE}${tel.slice(1)}`
}

/**
 * +81から始まる携帯番号を0から始まる番号に変換する
 * e.g. +819012341234 -> 09012341234
 * @param {string} tel ハイフン無しの電話番号
 */
export function normalizePhoneNumber(tel) {
  if (tel.startsWith('0')) return tel

  return '0' + tel.substring(JP_CODE.length)
}

/**
 * 国際番号を上4桁+下2桁に匿名化する
 * 国番号の桁数の違いは対応していないが、大体まかなえてるので今後必要があれば対応する
 * e.g. +6561234567 -> +6561****67
 * @param {string} tel ハイフン無しの国際電話番号
 */
export function anonymizePhoneNumber(phoneNumber) {
  if (!phoneNumber) return
  const first = phoneNumber.slice(0, 5)
  const last = phoneNumber.slice(-2)
  const mask = phoneNumber.replace(/\d/g, '*').slice(7)
  return `${first}${mask}${last}`
}

