const { firestore } = require('firebase-admin')
const mapValues = require('lodash/mapValues')

exports.Converter = {
  // Date型はフロント側で文字列にしてからリクエストされる。そのため文字列 -> Dateに変換する処理を行う。
  decodeDateFields(obj, dateFields) {
    dateFields.forEach(field => {
      if (obj[field]) obj[field] = new Date(obj[field])
    })

    return obj
  },

  // バックエンドに値を返すとき、firestore.Timestamp -> 文字列にする
  encodeDateFields(obj) {
    return mapValues(obj, value => value instanceof firestore.Timestamp ? value.toDate().toJSON() : value)
  },

  decodeTalentDateFields(talent) {
    return this.decodeDateFields(talent, ['createdAt', 'deadline', 'excuseDeadline'])
  },

  decodeRefereeDateFields(referee) {
    return this.decodeDateFields(referee, ['timeToBeginWorkingTogether', 'timeToEndWorkingTogether'])
  }
}
