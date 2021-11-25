// 一旦、バックチェックの質問を引用する
export const getDefaultQuestions = () => ({
  descriptions: [ // 記述式
    {
      key: 'mostContribution',
      text: {
        jp: '依頼者の最も貢献した実績を具体的に教えてください。',
        en: 'What was the greatest contribution about the candidate with details?',
        cn: '請具體告知候選者最具貢獻的績效。'
      }
    }, {
      key: 'lateness',
      text: {
        jp: '平均して月に何回ほど欠勤・遅刻（打ち合わせや商談を含む）があったか教えてください。',
        en: 'How many times in a month the candidate was absent or late (including internal and external meetings) on average?',
        cn: '請告知一個月平均幾次缺勤.遲到(包含開會或商談)。'
      }
    }, {
      key: 'advantageAndDisadvantage',
      text: {
        jp: '依頼者の強み (長所) ・弱み(短所)を具体的に教えてください。',
        en: 'What are the candidate’s strengths and weaknesses?',
        cn: '請具體告知候選者的擅長(優點)，不擅長(缺點)。'
      }
    }, {
      key: 'haveToConsiderate',
      text: {
        jp: '依頼者が新しい職場で活躍するために、会社・上司・同僚が留意すべき事項/配慮すべき事項を教えてください。',
        en: 'What the company/boss/colleagues should pay attention to/considerate about the candidate for he/she to play an active role in a new workplace?',
        cn: '請告知候選者在新職場能善用己身能力，公司.主管.同事該留意的事項/該顧慮的事項。'
      }
    }, {
      key: 'reasonForJobChange',
      text: {
        jp: '今回転職を検討した理由について、客観的にみてどのような点があげられるでしょうか？',
        en: 'What are the objective reasons the candidate is leaving its position?',
        cn: '這次考慮轉職的理由，以第三者視角舉例有那些呢?'
      }
    }, {
      key: 'expectationOfMotivation',
      text: {
        jp: '依頼者は仕事において何をモチベーションとして働いていると客観的に見て思いますか？そう思った具体的なエピソードや理由を含めて教えてください。',
        en: 'What do you think the candidate is motivated to do its job? Please tell us about the specific episode and reason you thought of.',
        cn: '候選者在職場上是用什麼做動力在上班呢?'
      }
    }, {
      key: 'goodForFirstTask',
      text: {
        jp: '依頼者が新しい職場で早期に活躍するために、最初に任せると成果を出せる可能性が高い仕事や役割は何だと思いますか？',
        en: 'What do you think is the job or role in which the candidate is likely to achieve good results for him/her to play an active role in a new workplace faster?',
        cn: '候選者能盡早適應新職場並能發揮實力，最能表現技能達到績效是什麼工作或職位呢?'
      }
    }, {
      key: 'goodCombinationType',
      text: {
        jp: '依頼者と相性が良いであろう、上司やメンターはどのようなタイプの人物でしょうか？理由も含めて教えてください。',
        en: 'What type of boss or mentor who would work well with the candidate? Please tell us with the reasons.',
        cn: '和候選者相處得來是什麼樣的上司或是長輩呢?請帶理由說明。'
      }
    }],
  selections: [ // 選択式
    {
      key: 'toleranceToBeScolded',
      text: {
        jp: '上司から指導や指摘される際、イライラしたり、ネガティブな傾向になっていた。',
        en: 'Was the candidate able to maintain its performance when being coached, or being pointed out?',
        cn: '當上司指導或是糾正之際，感到焦躁或是呈現負面的情緒。'
      }
    }, {
      key: 'goodAtComunication',
      text: {
        jp: '感情的な発言をするなど問題行動はなく、相手に対し思いやりのあるコミュニケーションができていた。',
        en: 'There was no problematic behavior such as not listening to any stories or making emotional remarks, and the candidate was always able to communicate with compassion.',
        cn: '沒有意氣用事發言或是不良表現，能善待別人做交流。'
      }
    }, {
      key: 'followTeamPolicy',
      text: {
        jp: 'チームの方針を理解し、全体の調和を乱すことなく仕事ができていた。',
        en: ' The candidate did not neglect the team\'s policies or harm the harmless behavior of the team.',
        cn: '能理解團隊的方針，能同心協力做出團隊中的工作。'
      }
    }, {
      key: 'noComplaints',
      text: {
        jp: '様々な局面で上手くいかないことがあっても、愚痴や弱音を吐くことはなかった。',
        en: 'The candidate did not complain or give negative opinions, even when something went wrong.',
        cn: '在各種不順利的局面也不會抱怨或怨言。'
      }
    }, {
      key: 'noEscapeDifficulty',
      text: {
        jp: '難しい状況の時に、諦めず最後まで解決しようとしていた。',
        en: 'The candidate was trying to solve a difficult problem or situation without giving up.',
        cn: '當遇到困難的局面，也不會輕易放棄而是努力去解決問題。'
      }
    }, {
      key: 'canApologize',
      text: {
        jp: '発生した問題や失敗を隠さずに、自らの非を認め謝罪・適切な報告・改善ができていた。',
        en: 'The candidate was able to apologize and improve him/her-self without concealing the problems and failures that occurred.',
        cn: '他们能够承认自己的过错，表示歉意，适当汇报，并进行改进，不隐瞒发生的问题和失败。'
      }
    }, {
      key: 'responsibility',
      text: {
        jp: '与えられた業務やタスクに対して期日までに終わらせる事ができていた。',
        en: 'The candidate had a sense of responsibility such as completing the given work or task by the deadline, and reporting if it cannot be completed.',
        cn: '我能够在截止日期前完成分配的工作和任务。'
      }
    }, {
      key: 'honest',
      text: {
        jp: '嘘をついたり、他人を中傷することがあった。',
        en: 'The candidate did sometimes lied or slandered others.',
        cn: '會說謊或是陷害他人。'
      }
    }, {
      key: 'noHarassment',
      text: {
        jp: 'パワハラやセクハラなどのハラスメント行為などが見受けられた。',
        en: 'The candidate was found to have harassing behavior such as power harassment and sexual harassment.',
        cn: '曾經有過性騷擾或是言語或肢體上的騷擾行為。'
      }
    }, {
      key: 'noPersonalInfoLeak',
      text: {
        jp: '会社の機密情報や個人情報の取り扱いについて理解をしてた。',
        en: 'The candidate had an understanding of the company\'s handling of confidential and personal information.',
        cn: '理解並能適當的管理公司的機密情報或是個人隱私。'
      }
    }, {
      key: 'lateness',
      text: {
        jp: '毎日就業時間に遅れることなく出社していた。',
        en: 'The candidate arrived at work every day without being late for work hours.',
        cn: '每天能不遲到的到職場。'
      }
    }, {
      key: 'qualityOfWork',
      text: {
        jp: '感情や体調に左右されず、一定のパフォーマンスで仕事ができていた。',
        en: 'The candidate was able to work at a constant performance, independent of his emotions and physical condition.',
        cn: '不會被情緒或是身體狀況影響，能保持一定水準的進行職務。'
      }
    }, {
      key: 'preciseCorrespondence',
      text: {
        jp: '情報漏洩等に対して、適切な対応をしていた。',
        en: 'The candidate took appropriate measures against information leaks, etc.',
        cn: '如機密情報洩漏時候能盡速並適當的解決狀況。'
      }
    }, {
      key: 'reportToBoss',
      text: {
        jp: '体調不良時等には、報連相をしっかりと行っていた。',
        en: 'The candidate made sure to follow the reporting process when he/she was not feeling well.',
        cn: '如身體不適時候還是能盡速完成呈報和聯絡。'
      }
    }, {
      key: 'initiative',
      text: {
        jp: '任された仕事に対して主体的に取り組んでいた。',
        en: 'The candidate was proactive in the work he was assigned to do.',
        cn: '交任的工作可以積極主動去進行完成該職務。'
      }
    }, {
      key: 'accomplishment',
      text: {
        jp: '最後まで諦めず、期日までに数字目標や業務目標を完遂できていた。',
        en: 'The candidate never gave up until the end and was able to complete his/her numerical and operational goals by the deadline.',
        cn: '為了完成預算目標或業務目標直到最後一刻都不放棄。'
      }
    }, {
      key: 'workTogetherAgain',
      text: {
        jp: 'また一緒に仕事をしたいと思う。',
        en: 'You want to work with him/her again.',
        cn: '期待可以再一起工作。'
      }
    }
  ]
})

export const getDefaultQuestionsForRookie = () => ({
  descriptions: [ // 記述式
    {
      key: 'mostContribution',
      text: {
        jp: '依頼者の最も貢献した実績を具体的に教えてください。',
        en: 'What was the greatest contribution about the candidate with details?',
        cn: '請具體告知候選者最具貢獻的績效。'
      }
    }, {
      key: 'lateness',
      text: {
        jp: '平均して月に何回ほど欠勤・遅刻（打ち合わせや商談を含む）があったか教えてください。',
        en: 'How many times in a month the candidate was absent or late (including internal and external meetings) on average?',
        cn: '請告知一個月平均幾次缺勤.遲到(包含開會或商談)。'
      }
    }, {
      key: 'advantageAndDisadvantage',
      text: {
        jp: '依頼者の強み (長所) ・弱み(短所)を具体的に教えてください。',
        en: 'What are the candidate’s strengths and weaknesses?',
        cn: '請具體告知候選者的擅長(優點)，不擅長(缺點)。'
      }
    }, {
      key: 'haveToConsiderate',
      text: {
        jp: '依頼者が新しい職場で活躍するために、会社・上司・同僚が留意すべき事項/配慮すべき事項を教えてください。',
        en: 'What the company/boss/colleagues should pay attention to/considerate about the candidate for he/she to play an active role in a new workplace?',
        cn: '請告知候選者在新職場能善用己身能力，公司.主管.同事該留意的事項/該顧慮的事項。'
      }
    }, {
      key: 'reasonForJobChange',
      text: {
        jp: '今回転職を検討した理由について、客観的にみてどのような点があげられるでしょうか？',
        en: 'What are the objective reasons the candidate is leaving its position?',
        cn: '這次考慮轉職的理由，以第三者視角舉例有那些呢?'
      }
    }, {
      key: 'expectationOfMotivation',
      text: {
        jp: '依頼者は仕事において何をモチベーションとして働いていると客観的に見て思いますか？そう思った具体的なエピソードや理由を含めて教えてください。',
        en: 'What do you think the candidate is motivated to do its job? Please tell us about the specific episode and reason you thought of.',
        cn: '候選者在職場上是用什麼做動力在上班呢?'
      }
    }, {
      key: 'goodForFirstTask',
      text: {
        jp: '依頼者が新しい職場で早期に活躍するために、最初に任せると成果を出せる可能性が高い仕事や役割は何だと思いますか？',
        en: 'What do you think is the job or role in which the candidate is likely to achieve good results for him/her to play an active role in a new workplace faster?',
        cn: '候選者能盡早適應新職場並能發揮實力，最能表現技能達到績效是什麼工作或職位呢?'
      }
    }, {
      key: 'goodCombinationType',
      text: {
        jp: '依頼者と相性が良いであろう、上司やメンターはどのようなタイプの人物でしょうか？理由も含めて教えてください。',
        en: 'What type of boss or mentor who would work well with the candidate? Please tell us with the reasons.',
        cn: '和候選者相處得來是什麼樣的上司或是長輩呢?請帶理由說明。'
      }
    }],
  selections: [ // 選択式
    {
      key: 'greeting',
      text: {
        jp: 'しっかりと挨拶ができる。',
        en: 'Be able to introduce him/herself well.',
        cn: '會打招呼'
      }
    }, {
      key: 'laziness',
      text: {
        jp: '無断欠勤、遅刻があった。',
        en: 'There were unexcused absences and late arrivals.',
        cn: '曾有遲到或是缺勤。'
      }
    }, {
      key: 'healthCare',
      text: {
        jp: '体調管理ができていた。',
        en: 'The candidate could take well care about his/her health.',
        cn: '能做身體健康管理。'
      }
    }, {
      key: 'goodReaction',
      text: {
        jp: '指示を出した時に、元気な返事ができていた。',
        en: 'The candidate was able to answer with positive attitude to any instructions.',
        cn: '被指示時候，能正面的回覆。'
      }
    }, {
      key: 'noComplaints',
      text: {
        jp: '面倒臭い仕事でも、嫌な顔や態度に出さなかった。',
        en: 'The candidate did not give had attitude in a tedious job.',
        cn: '遇到棘手的工作也不曾做出苦臉或是負面情緒。'
      }
    }, {
      key: 'workTogetherAgain',
      text: {
        jp: 'また一緒に働きたいと思う。',
        en: 'You want to work with him/her again.',
        cn: '會讓人想再一起工作。'
      }
    }, {
      key: 'talkative',
      text: {
        jp: '仕事中に私語が多かった。',
        en: 'There was a lot of chit-chat while working.',
        cn: '工作時候常有和職務無關的閒談。'
      }
    }, {
      key: 'tooMuchComplaints',
      text: {
        jp: '愚痴や文句を言うことが多かった。',
        en: 'The candidate often made complaints.',
        cn: '牢骚满腹，怨声载道。'
      }
    }, {
      key: 'workQuickly',
      text: {
        jp: 'テキパキ行動していた。',
        en: 'The candidate worked quickly and efficiently.',
        cn: '職場上表現積極迅速的行動。'
      }
    }, {
      key: 'negative',
      text: {
        jp: 'どちらかというと発言がネガティブだった。',
        en: 'The candidate often made negative comments.',
        cn: '可以說是比較多負面發言的人。'
      }
    }, {
      key: 'aspiration',
      text: {
        jp: '成⻑しようという意志が強かった。',
        en: 'The candidate had will to be better.',
        cn: '有強烈渴望成功的意志力。'
      }
    }, {
      key: 'workHarder',
      text: {
        jp: '周りの人よりも人一倍努力する姿勢があった。',
        en: 'The candidate was more willing to work harder than others.',
        cn: '比周遭任何人都來的努力。'
      }
    }, {
      key: 'preciseWordChoice',
      text: {
        jp: '言葉遣いがしっかりとできていた。',
        en: 'The candidate could use polite languages.',
        cn: '能用對措詞說話。'
      }
    }, {
      key: 'politeness',
      text: {
        jp: '人に対して礼儀正しかった。',
        en: 'The candidate knows business manners.',
        cn: '善待禮貌地對待人。'
      }
    }, {
      key: 'respectSenior',
      text: {
        jp: '目上の人とでも正しい言葉でコミュニケーションをとることができていた。',
        en: 'The candidate could communicate properly with executive levels.',
        cn: '不失禮的能和長輩交流溝通。'
      }
    }, {
      key: 'abusiveLanguage',
      text: {
        jp: '気に入らないことがあると、暴言を吐いていた。',
        en: 'The candidate behaved badly with words when he/she was in bad mood.',
        cn: '當有不如意的事情時候會說出粗俗言詞。'
      }
    }, {
      key: 'keepCalm',
      text: {
        jp: '機嫌が悪いと、仕事を適当にしていた。',
        en: 'The candidate did his job appropriately when he/she was in a bad mood.',
        cn: '心情不好時候工作表現也會降低。'
      }
    }, {
      key: 'theWayTreatStuff',
      text: {
        jp: '物を大切に扱わない。',
        en: 'The candidate did not use office supply respectfully.',
        cn: '不珍惜或善用物品。'
      }
    }, {
      key: 'cherishFamilyAndFriends',
      text: {
        jp: '家族や友人を大切にしていた。',
        en: 'The candidate showed respects his/her family and friends.',
        cn: '善待家人和朋友。'
      }
    }
  ]
})

/**
 * @param {'jp'|'en'|'cn'} lang
 */
export const getDefaultQuestionsByLang = lang => ({
  descriptions: getDefaultQuestions().descriptions.map(({ key, text }) => ({ key, text: text[lang] })),
  selections: getDefaultQuestions().selections.map(({ key, text }) => ({ key, text: text[lang] }))
})

export const getDefaultQuestionsForRookieByLang = lang => ({
  descriptions: getDefaultQuestionsForRookie().descriptions.map(({ key, text }) => ({ key, text: text[lang] })),
  selections: getDefaultQuestionsForRookie().selections.map(({ key, text }) => ({ key, text: text[lang] }))
})

// keyを質問のタイプで分類
export const questionTypeAndKeys = {
  compliance: ['noPersonalInfoLeak', 'preciseCorrespondence', 'honest', 'noHarassment'],
  attendance: ['lateness', 'reportToBoss'],
  responsibility: ['noEscapeDifficulty', 'canApologize', 'responsibility'],
  attitude: ['initiative', 'goodAtComunication', 'followTeamPolicy'],
  accomplishment: ['accomplishment', 'qualityOfWork'],
  tolerance: ['noComplaints', 'toleranceToBeScolded'],
  others: ['workTogetherAgain']
}

export const selectionPatterns = {
  positivePattern: [
    'goodAtComunication',
    'followTeamPolicy',
    'noComplaints',
    'noEscapeDifficulty',
    'canApologize',
    'responsibility',
    'noPersonalInfoLeak',
    'lateness',
    'qualityOfWork',
    'preciseCorrespondence',
    'reportToBoss',
    'initiative',
    'accomplishment',
    'workTogetherAgain',
    'greeting',
    'healthCare',
    'goodReaction',
    'workQuickly',
    'aspiration',
    'workHarder',
    'preciseWordChoice',
    'politeness',
    'respectSenior',
    'cherishFamilyAndFriends'
  ],
  negativePattern: [
    'toleranceToBeScolded',
    'honest',
    'noHarassment',
    'laziness',
    'talkative',
    'tooMuchComplaints',
    'negative',
    'abusiveLanguage',
    'keepCalm',
    'theWayTreatStuff'
  ]
}

// TODO: 仮翻訳につき要変更
export const radioSelectionText = {
  jp: ['そう思わない', 'まあそう思わない', 'どちらとも言えない', 'まあそう思う', 'そう思う'],
  en: ['I don\'t think so', 'well I don\'t think so', 'neither do I think so', 'well I think so', 'I think'],
  cn: ['我不这么认为。', '我不这么认为。', '我也不能说。', '嗯，我想是的。', '我们认为是这样。']
}
export const radioSelectionScore = [2, 4, 6, 8, 10]

export const ESTIMETED_MINUTES_PER_ONE_QUESTION = { // 1問あたりの推定回答時間(分)
  descriptions: 0.8,
  selections: 0.8
}

export const defaultQuestionCount = {
  descriptions: getDefaultQuestions().descriptions.length,
  selections: getDefaultQuestions().selections.length
}
