/**
 * TODO: src/constants/questions.jsにあるのでDRYじゃない。なんとかしたい。
 */
const ESTIMETED_MINUTES_PER_ONE_QUESTION = { // 1問あたりの推定回答時間(分)
  descriptions: 0.8,
  selections: 0.8
}

/**
 * @param {object} arg
 * @param {number} arg.descriptionCount 「記述式の質問」の数
 * @param {number} arg.selectionCount   「選択式の質問」の数
 * @return 推定回答時間(分)
 */
exports.calcEstimatedMinutes = ({ descriptionCount, selectionCount }) => Math.floor(
  ESTIMETED_MINUTES_PER_ONE_QUESTION.descriptions * descriptionCount +
  ESTIMETED_MINUTES_PER_ONE_QUESTION.selections * selectionCount
)

