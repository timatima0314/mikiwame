export const statusProperty = {
  talentRegistered: {
    key: 'talentRegistered',
    text: 'メール未送信',
    style: 'background: #dc3545;',
    stepNum: 0
  },
  mailSend: {
    key: 'mailSend',
    text: 'メール未開封',
    style: 'background: #ff6e19;',
    stepNum: 1
  },
  agreeToPrivacyPolicy: {
    key: 'agreeToPrivacyPolicy',
    text: '推薦者未登録',
    style: 'background: #ffc107;',
    stepNum: 2
  },
  refereesRegistered: {
    key: 'refereesRegistered',
    text: '推薦者未回答',
    style: 'background: #007bff;',
    stepNum: 3
  },
  refereesAnswered: {
    key: 'refereesAnswered',
    text: '完了',
    style: 'background: #28a745;',
    stepNum: 5
  }
}
