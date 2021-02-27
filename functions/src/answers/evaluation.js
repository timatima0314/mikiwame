const { companiesCollectionRef } = require('../plugins/firestore')
const get = require('lodash/get')
const functions = require('firebase-functions')
const questionPoint = 0.5
const othersQuestionPoint = 2.0
const maxScore = 10
// keyを質問のタイプで分類
const questionTypeAndKeys = {
  compliance: ['noPersonalInfoLeak', 'preciseCorrespondence', 'honest', 'noHarassment'],
  attendance: ['lateness', 'reportToBoss', 'laziness', 'healthCare'],
  responsibility: ['noEscapeDifficulty', 'canApologize', 'responsibility', 'aspiration', 'workHarder', 'keepCalm'],
  attitude: ['initiative', 'goodAtComunication', 'followTeamPolicy', 'greeting', 'goodReaction', 'talkative', 'preciseWordChoice', 'politeness', 'respectSenior'],
  accomplishment: ['accomplishment', 'qualityOfWork', 'workQuickly'],
  tolerance: ['noComplaints', 'toleranceToBeScolded', 'tooMuchComplaints', 'negative', 'abusiveLanguage', 'theWayTreatStuff'],
  others: ['workTogetherAgain', 'cherishFamilyAndFriends']
}

module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .https
  .onCall(async (data) => {
    if (data.awakeRun) return null

    const { companyId, talentId } = data
    const talentDocumentRef = companiesCollectionRef.doc(companyId).collection('talents').doc(talentId)
    const referees = await getReferees(companyId, talentId)
    const scoreData = {
      ...fromEntries(Object.keys(questionTypeAndKeys).map(questionType => [questionType, { score: 0, maxScore: 0 }])),
      totalScore: { score: 0, maxScore: 0 }
    }
    // score -> 回答者の点数の合計, maxScore -> 回答が全て10点満点と仮定した時の合計点数
    // 各質問タイプごとに点数のパーセンテージ(score / maxScore * 100)を計算し、評価する
    referees.forEach(referee => {
      const selections = get(referee, 'answer.selections')
      if (!selections) return
      Object.entries(selections).forEach(([key, score]) => {
        const [questionType] = Object.entries(questionTypeAndKeys).find(([, keys]) => keys.includes(key))
        const { point, maxPoint } = questionType === 'others'
          ? { point: score * othersQuestionPoint, maxPoint: maxScore * othersQuestionPoint }
          : { point: score * questionPoint, maxPoint: maxScore * questionPoint }
        scoreData[questionType].score += point
        scoreData.totalScore.score += point
        scoreData[questionType].maxScore += maxPoint
        scoreData.totalScore.maxScore += maxPoint
      })
    })
    const result = Object.entries(scoreData).map(([questionType, scores]) => [questionType, evaluateScores(scores.score / scores.maxScore * 100)])
    talentDocumentRef.set({
      evaluation: {
        ...fromEntries(result)
      }
    }, { merge: true })
  })

function evaluateScores(result) {
  switch (true) {
  case result >= 90:
    return 'A'
  case result >= 70:
    return 'B'
  case result >= 50:
    return 'C'
  case result >= 30:
    return 'D'
  case result >= 0:
    return 'E'
  default:
    return null
  }
}

async function getReferees(companyId, talentId) {
  const snapshot = await companiesCollectionRef.doc(companyId).collection('talents').doc(talentId).collection('referees').get()
  return snapshot.docs.map(doc => doc.data())
}

function fromEntries(array) {
  return array.reduce((obj, [key, val]) => {
    obj[key] = val
    return obj
  }, {})
}
