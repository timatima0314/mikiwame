const functions = require('firebase-functions')
const fs = require('fs').promises
const template = require('lodash/template')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(functions.config().apikey.sendgrid)

exports.sendMail = function({ to, from = 'info@mikiwame-p.jp', subject, text, html }) {
  if (to === undefined) new Error('[sendMail] `to` is missing')
  if (subject === undefined) new Error('[sendMail] `subject` is missing')
  if (text === undefined) new Error('[sendMail] `text` is missing')
  if (html === undefined) new Error('[sendMail] `html` is missing')

  return sgMail.send({ to, from, subject, text, html })
}

/**
 * 指定されたpathのテンプレートファイルにtemplateReplaceArgsに則って文字を埋め込んで返却する
 *
 * @param {string} path
 * @param {{[key: string]: string | number}} templateReplaceArgs
 * @return {Promise<string>}
 */
async function compile(path, templateReplaceArgs) {
  const file = await fs.readFile(path, 'utf-8')
  const compiled = template(file)
  return compiled(templateReplaceArgs)
}

exports. generteMailToTalentTextfromTempalate = function({ talentName, companyName, deadline, mailI18n, estimatedMinutes, linkToTalentPage, linkToUnsubscribe }) {
  // cloud functionsで実行するために、functionsディレクトリからの相対パスにする
  return compile('src/notification/templates/mail_to_talent.jp.txt', { talentName, companyName, deadline, mailI18n, estimatedMinutes, linkToTalentPage, linkToUnsubscribe })
}

exports.generateMailToTalentHTMLfromTemplate = function({ talentName, companyName, deadline, mailI18n, estimatedMinutes,  linkToTalentPage, linkToUnsubscribe }) {
  return compile('src/notification/templates/mail_to_talent.jp.html', { talentName, companyName, deadline, mailI18n, estimatedMinutes, linkToTalentPage, linkToUnsubscribe })
}

exports. generteMailToTalentRegainTrustTextfromTempalate = function({ talentName, companyName, deadline, linkToRegainTrustPage }) {
  return compile('src/notification/templates/mail_to_talent_regain_trust.jp.txt', { talentName, companyName, deadline, linkToRegainTrustPage })
}

exports.generateMailToTalentRegainTrustHTMLfromTemplate = function({ talentName, companyName, deadline, linkToRegainTrustPage, linkToUnsubscribe }) {
  return compile('src/notification/templates/mail_to_talent_regain_trust.jp.html', { talentName, companyName, deadline, linkToRegainTrustPage, linkToUnsubscribe  })
}

exports. generteMailToRefereeTextfromTempalate = function({ refereeName, talentName, estimatedMinutes, deadline, linkToRefereePage, linkToUnsubscribe }) {
  return compile('src/notification/templates/mail_to_referee.jp.txt', { refereeName, talentName, estimatedMinutes, deadline, linkToRefereePage, linkToUnsubscribe })
}

exports.generateMailToRefereeHTMLfromTemplate = function({ refereeName, talentName, estimatedMinutes, deadline, linkToRefereePage, linkToUnsubscribe }) {
  return compile('src/notification/templates/mail_to_referee.jp.html', { refereeName, talentName, estimatedMinutes, deadline, linkToRefereePage, linkToUnsubscribe })
}

exports.generteMailToSubAccountTextfromTempalate = function ({ companyName, subAccountName, linkToPasswordSettingPage }) {
  return compile('src/notification/templates/mail_to_sub_account.jp.txt', { companyName, subAccountName, linkToPasswordSettingPage })
}

exports.generateMailToSubAccountHTMLfromTemplate = function ({ companyName, subAccountName, linkToPasswordSettingPage }) {
  return compile('src/notification/templates/mail_to_sub_account.jp.html', { companyName, subAccountName, linkToPasswordSettingPage })
}
