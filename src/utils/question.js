import { ESTIMETED_MINUTES_PER_ONE_QUESTION } from '@/constants/questions'

/**
 * @param {object} arg
 * @param {number} arg.descriptionCount 「記述式の質問」の数
 * @param {number} arg.selectionCount   「選択式の質問」の数
 * @return 推定回答時間(分)
 */
export const calcEstimatedMinutes = ({ descriptionCount, selectionCount }) => Math.floor(
  ESTIMETED_MINUTES_PER_ONE_QUESTION.descriptions * descriptionCount +
  ESTIMETED_MINUTES_PER_ONE_QUESTION.selections * selectionCount
)
