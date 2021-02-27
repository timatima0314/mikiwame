const Polyglot = require('node-polyglot')

const translate = {
  mail: {
    jp: {
      honorific: '様',
      honorificName: '%{name}様',
      subject: '【MiKiWaMe Point】リファレンスチェックのお願い',
      subjectDeadline: '(期限: %{deadline})',
      openingSentence: 'MiKiWaMe Point 運営事務局',
      dear: '%{honorificName}',
      requestForReferenceCheck: '%{companyName}%{honorific}より、%{talentName}%{honorific}へリファレンスチェックの依頼が届いています。',
      referenceCheckExplanation1: 'リファレンスチェックとは、候補者様に対して、以前または現職の同僚や上司らからアンケートを実施することによって、候補者様の経歴、実績、スキルなどに関する評価をインタビューする採⽤⼿法のことです。才能を評価し有利な転職を。',
      referenceCheckExplanation2: '回答内容は候補者様には確認することが出来ず、また外部へ開示することはございません。回答は過去または現在に所属する組織としての意見ではなく、あくまで個人の意見としてご回答いただきます。',
      averageTimeRequired: '平均所要時間：約%{minute}分',
      responseWillBeSent: '推薦者様からの回答が完了次第、応募企業に回答内容が送信されます。',
      noDeadline: '回答完了期日',
      deadline: '回答完了期日: %{deadline}',
      requiredSteps: '以下のフローに沿ってご対応ください。',
      flowRegister: '推薦者様の情報を登録する',
      flowPublishing: '各推薦者様に対して回答依頼ページのURLを発行する',
      flowSend: '発行したURLを各種SNS等を通じて推薦者様へ送信する',
      linkToTalentPage: '以下リンクより推薦者様のご登録を進めていただくことが出来ます。',
      helpDeadlineText: '期⽇中にリファレンスが完了するようにご協⼒をお願い申し上げます。',
      linkUnsuclibe: '配信停止はこちら',
      toRegisterRecommenders: '推薦者登録はこちら',
      linkPolicy: '個人情報保護方針(プライバシーポリシー)'
    },
    en: {
      honorific: 'Mr. ',
      honorificName: 'Mr. %{name}',
      subject: '[MiKiWaMe Point] Request for Reference Check',
      subjectDeadline: ' (Due: %{deadline})',
      openingSentence: 'We hope this email finds you well.',
      dear: 'Dear %{honorificName}',
      requestForReferenceCheck: 'We are emailing you because the company for which %{companyName} has applied has sent a request for a reference check to us.',
      referenceCheckExplanation1: 'A reference check is a method of obtaining information about a candidate\'s personality and background by surveying their former and current colleagues and supervisors.',
      referenceCheckExplanation2: 'The survey will be used only the purpose of this recruitment process and will not be disclosed to the candidate or anyone else.',
      averageTimeRequired: 'Average time required: about %{minute} minutes',
      responseWillBeSent: 'As soon as references complete the response, the content of the response will be sent to the applying company.',
      noDeadline: 'Deadline for responses',
      deadline: 'Date:%{deadline}',
      requiredSteps: 'Required steps are as listed below.',
      flowRegister: 'Register your recommenders\' information.',
      flowPublishing: 'Issue the URL of the response request page to each nominee.',
      flowSend: 'Send the published URL to the nominee through various SNS, etc.',
      linkToTalentPage: 'Please click on the link below to register your references.',
      helpDeadlineText: 'Please help us to complete the reference check by the due date.',
      linkUnsuclibe: 'Click here to unsubscribe.',
      toRegisterRecommenders: 'Click here to register your recommenders',
      linkPolicy: 'Personal Information Protection Policy'
    },
    cn: {
      honorific: '先生/女士',
      honorificName: '%{name} 先生/女士',
      subject: '【MiKiWaMe Point】背景調查請求',
      subjectDeadline: '(期限: %{deadline})',
      openingSentence: '這裡是MiKiWaMe Point 營運事務所。',
      dear: '%{honorificName}',
      requestForReferenceCheck: '有來自%{talentName}%{honorific}的招募企業的背景調查的詢問。',
      referenceCheckExplanation1: '背景調查是對企業的應徵者(以下稱，候選者)的前或現任公司同仁或上司做問卷調查，並能得到候選者的人格或是資歷等情報的手法。',
      referenceCheckExplanation2: '從此問卷得到的回答等內容，僅本錄取活動中做使用，不會對外部包含候選者公開。',
      averageTimeRequired: '平均所需时间：约%{minute}分钟',
      responseWillBeSent: '推薦者完成回复后，将尽快向申请企业发送回复。',
      noDeadline: '答复日期',
      deadline: '%{deadline}',
      requiredSteps: '問卷的回答按照以下步驟。',
      flowRegister: '登记您的提名人信息',
      flowPublishing: '向每个被提名人发出响应请求页的URL。',
      flowSend: '通过各种SNS等向被提名人发送发布的网址。',
      linkToTalentPage: '请点击以下链接注册成为被推薦者。',
      helpDeadlineText: '请帮助我们在截止日期前完成参考调查。',
      linkUnsuclibe: '点击这里取消订阅',
      toRegisterRecommenders: '点击这里登记您的提名',
      linkPolicy: '个人信息保护政策'
    }
  }
}

// mailI18n.t('subject') + mailI18n.t('subjectDeadline', { deadline: deadlineString })
// mailI18n.t('honotific', {name: talentName})

exports.getI18n = function(val, lng){
  return new Polyglot({ phrases: translate[val][lng] })
}
