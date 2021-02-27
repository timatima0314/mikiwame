/**
 * 携帯番号を+81から始まる番号に変換する
 * e.g. 09011111111 -> +819011111111
 * @param {stirng} tel ハイフン無しの電話番号
 */
export function formatPhoneNumber(tel) {
  return `+81${tel.slice(1)}`
}

/**
 * +81から始まる携帯番号を0から始まる番号に変換する
 * e.g. +819012341234 -> 09012341234
 * @param {stirng} tel ハイフン無しの電話番号
 */
export function normalizePhoneNumber(tel) {
  if (tel.startsWith('0')) return tel

  return '0' + tel.substring('+81'.length)
}

/**
 * 電話番号を上3桁+下2桁に匿名化する
 * e.g. 09012341234 -> 090-****-**34
 * @param {stirng} tel ハイフン無しの電話番号
 */
export function anonymizePhoneNumber(tel) {
  return `${tel.substring(0, 3)}-****-**${tel.substring(9)}`
}

