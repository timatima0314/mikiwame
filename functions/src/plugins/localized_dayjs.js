const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * cloud functions環境では、普通にdayjsを扱おうとするとUTCの時刻が返ってきてしまう。
 * そのため、日本時間が返ってくるようにする
 * @param {Date|null} date
 * @example
 * const { dayjs } = require('../plugins/localized_dayjs')
 * dayjs().format()
 */
exports.dayjs = (date = null) => {
  const dayjsInstance = date === null ? dayjs() : dayjs(date)
  return dayjsInstance.tz('Asia/Tokyo')
}
