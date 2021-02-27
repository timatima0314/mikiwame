import dayjs from 'dayjs'
/**
 * 日数の差を返す。時間は考慮せず、日付部分のみで計算
 * @param {Date} dateA
 * @param {Date} dateB
 */
export const calcDayDiff = (dateA, dateB) => {
  console.log(dayjs(dateA).toDate())
  const startOfDateA = dayjs(dateA).startOf('day')
  const startOfDateB = dayjs(dateB).startOf('day')
  return startOfDateA.diff(startOfDateB, 'day')
}
