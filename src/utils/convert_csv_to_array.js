import Encoding from 'encoding-japanese'

export const convertCsvToArray = (file) => {
  // 8ビット符号なし整数値配列と見なす
  let array = new Uint8Array(file)

  // 文字コードを取得
  switch (Encoding.detect(array)) {
    case 'UTF16':
      // 16ビット符号なし整数値配列と見なす
      array = new Uint16Array(file)
      break
    case 'UTF32':
      // 32ビット符号なし整数値配列と見なす
      array = new Uint32Array(file)
      break
  }
  // Unicodeの数値配列に変換
  const unicodeArray = Encoding.convert(array, 'UNICODE')
  // Unicodeの数値配列を文字列に変換
  const csv = Encoding.codeToString(unicodeArray)
  // header:CSV1行目の項目 :csvRows:項目に対する値
  const [header, ...csvRows] = csv.split('\n').filter(function(row) {
    if (row !== '') {
      return row
    }
  }).map((row) => row.split(','))
  const tmpResultArray = csvRows.map(function(r) {
    let arrayInKeyAndValue = header.map(function(_, index) {
      // ヘッダーの空白文字を削除。keyとvalueに値をセット
      return ({ key: header[index].replace(/\s+/g, ''), value: r[index] })
    })
    arrayInKeyAndValue = arrayInKeyAndValue.reduce(function(previous, current) {
      previous[current.key] = current.value
      return previous
    }, {})
    return arrayInKeyAndValue
  })
  const resultArray = tmpResultArray.reduce(function(previous, current, index) {
    previous[index] = current
    return previous
  }, {})
  return resultArray
}
