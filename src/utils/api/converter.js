import mapValues from 'lodash/mapValues'

export const Converter = {
  // Date型はバックエンド側で文字列にしてから返却される。そのため文字列 -> Dateに変換する処理を行う。
  decodeDateFields(obj, dateFields) {
    dateFields.forEach(field => {
      if (obj[field]) obj[field] = new Date(obj[field])
    })

    return obj
  },

  // バックエンドに値を返すとき、Date -> 文字列にする
  encodeDateFields(obj) {
    return mapValues(obj, value => value instanceof Date ? value.toJSON() : value)
  },

  decodeTalentDateFields(talent) {
    return this.decodeDateFields(talent, ['createdAt', 'deadline'])
  },

  decodeRefereeDateFields(referee) {
    return this.decodeDateFields(referee, ['timeToBeginWorkingTogether', 'timeToEndWorkingTogether'])
  }
}
