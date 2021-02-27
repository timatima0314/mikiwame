/* global process */
require('dotenv').config()
const test = require('firebase-functions-test')({
  ...JSON.parse(process.env.FIREBASE_CONFIG_TEST)
}, 'credential.json')

// 環境変数のモック
test.mockConfig({
  payment: {
    base_url: process.env.BASE_URL,
    site_id: process.env.SITE_ID,
    site_pass: process.env.SITE_PASS,
    shop_id: process.env.SHOP_ID,
    shop_pass: process.env.SHOP_PASS
  }
})

exports.test = test
