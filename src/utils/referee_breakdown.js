/**
 * フォームに入力された推薦者内訳が重複していないかチェック
 * @param {breakdownData[]} breakdownForm フォームに入力された推薦者内訳
 */
export function checkDuplicationOfBreakdown(breakdownForm) {
  return breakdownForm.some((targetBreakdown, i) => (
    breakdownForm.slice(i + 1).some(breakdownForComparison => {
      const isBreakdownSame = breakdownForComparison.relationship === targetBreakdown.relationship && breakdownForComparison.timeWorkingTogether === targetBreakdown.timeWorkingTogether
      const isDescriptionSame = breakdownForComparison.otherRelationship === targetBreakdown.otherRelationship && breakdownForComparison.otherTimeWorkingTogether === targetBreakdown.otherTimeWorkingTogether
      return isBreakdownSame && isDescriptionSame
    })
  ))
}

/**
 * 既に候補者により追加された分の推薦者内訳は変更できないようにする
 * 以下の処理で人事側が指定したrefereeBreakdownに該当するrefereesを判別し、
 * 指定したrefereeBreakdownのうち何人が既に候補者によって追加されているか調べる
 * @param {refereeData[]} referees 推薦者の配列
 * @param {object} breakdown 推薦者内訳の情報
 */
export function calculateRegisteredRefereesNum(referees, breakdown) {
  return referees.filter(referee => {
    const isSelectedByCompanyBothSame = referee.isRelationshipSelectedByCompany === breakdown.isRelationshipSelectedByCompany &&
      referee.isTimeWorkingTogetherSelectedByCompany === breakdown.isTimeWorkingTogetherSelectedByCompany
    if (!isSelectedByCompanyBothSame) return false

    // referee.is...で内訳が人事側で指定されているか判別
    // 指定されていた場合に内訳と保存されている推薦者の情報を比較
    const isRelationshipSame = referee.relationship === breakdown.relationship
    const isTimeWorkingTogetherSame = referee.timeWorkingTogether === breakdown.timeWorkingTogether
    const isRelationshipSelectedButNotMatch = referee.isRelationshipSelectedByCompany && !isRelationshipSame
    const isTimeWorkingTogetherSelectedButNotMatch = referee.isTimeWorkingTogetherSelectedByCompany && !isTimeWorkingTogetherSame
    if (!referee.isRelationshipSelectedByCompany && !referee.isTimeWorkingTogetherSelectedByCompany) return false
    if (isRelationshipSelectedButNotMatch || isTimeWorkingTogetherSelectedButNotMatch) return false

    // その他を選択した場合、記述が一致しているか調べる
    const isOtherRelationshipSame = referee.otherRelationship === breakdown.otherRelationship
    const isOtherTimeWorkingTogetherSame = referee.otherTimeWorkingTogether === breakdown.otherTimeWorkingTogether
    const isOtherRelationshipFilledButNotMatch = breakdown.otherRelationship && !isOtherRelationshipSame
    const isOtherTimeWorkingTogetherFilledButNotMatch = breakdown.otherTimeWorkingTogether && !isOtherTimeWorkingTogetherSame
    if (isOtherRelationshipFilledButNotMatch || isOtherTimeWorkingTogetherFilledButNotMatch) return false

    return true
  }).length
}
