# Cluod Functions
## 環境変数
### 例
```json
{
  "apikey": {
    "sendgrid": ""
  },
  "risk_eyes": {
    "password": "",
    "access_key": "",
    "username": ""
  },
  "payment": {
    "shop_id": "サイト管理画面＞サイト管理のサイトID",
    "site_pass": "サイト管理画面＞サイト管理のサイトパスワード",
    "shop_pass": "ショップ管理画面＞ショップ管理のショップパスワード",
    "site_id": "ショップ管理画面＞ショップ管理のショップID",
    "base_url": "ショップ管理画面＞ショップ管理＞API情報 https://*.jp/payment の部分"
  },
  "dns": {
    "domain": "サイトのドメイン部分 e.g. app.mikiwame-p.jp"
  }
}
```
### 設定方法
```shell
firebase use default # 本番環境: default. 開発環境: dev
firebase functions:config:set apikey.sendgrid="~"
firebase deploy --only functions
```