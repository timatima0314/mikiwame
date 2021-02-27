# mikiwame
![Prod Hosting](https://github.com/team-5g/mikiwame/workflows/Prod%20Hosting/badge.svg?branch=master)
![Prod Cloud Functions](https://github.com/team-5g/mikiwame/workflows/Prod%20Cloud%20Functions/badge.svg?branch=master)
![Dev Hosting](https://github.com/team-5g/mikiwame/workflows/Dev%20Hosting/badge.svg)
![Dev Cloud Functions](https://github.com/team-5g/mikiwame/workflows/Dev%20Cloud%20Functions/badge.svg)

## 使用技術
- Node (>=12.16.1)
- npm (>=6.0.0)
- Firebase (Auth, Firestore, Hosting)
- [vue-element-tempalte](https://github.com/PanJiaChen/vue-admin-template) (ボイラープレート)

全体の設計は[vue-element-adminのドキュメント](https://panjiachen.github.io/vue-element-admin-site/)に書いてあります。

## 開発環境の構築方法

```bash
git clone https://github.com/team-5g/mikiwame.git
cd mikiwame

# 環境変数を設定
cp dotenv.production .env.production
cp dotenv.staging .env.staging
cp dotenv.development .env.development
# FirebaseのAPI_KEY等を.env.{production, staging, development}に設定する必要があります。
# ここには書けないので、既存メンバーにSlackで聞いてください

# Nodeの設定
nodebrewやnvmを使ってnodeの12.16.xが使えるようにしてください。

# 依存関係のインストール
npm ci
npm run dev
```
http://localhost:9528 が自動で開かれます

## ローカルでのCloud functions実行方法
1. `.env.development`の以下の行のコメントをはずす
```
VUE_APP_FUNCTIONS_EMULATOR_PORT=5000
```
2. GCPコンソールの「IAMと管理>サービスアカウント>firebase-adminsdk...>鍵の追加>鍵の作成」をクリックし、JSONファイルを保存。
![image](https://user-images.githubusercontent.com/40315079/89014193-1ddba600-d350-11ea-9ae7-f4f7b9fc3acf.png)
3. shellでこのプロジェクトに移動して以下のコマンドを実行
```
export GOOGLE_APPLICATION_CREDENTIALS=`先ほどGCPのコンソールから保存したJSONファイルへの絶対パス`
firebase use dev
firebase functions:config:get > functions/.runtimeconfig.json
firebase serve --only functions
```
この状態で`npm run dev`するとローカルのfunctionsエミュレーターが発動します

## デプロイ方法
事前に`firebase-tools`をインストールしましょう
```bash
npm i -g firebase-tools
```
- ローカルからHostingしたい場合(緊急時以外は行わないこと)
```bash
npm run build:prod
firebase use default # 本番環境を対象にする場合
firebase use dev # dev環境を対象にする場合
firebase deploy --hosting
```
- プルリクを出す際、dev環境にfunctionsをデプロイしたい場合(deploy previewでfunctionsの確認をするためには、dev環境に手動でデプロイしておく必要があります。)
```bash
firebase use dev
firebase deploy --only functions:<デプロイしたい関数名>
```

## その他
```bash
# lintでコードの規約が守られているかをチェックします
# しばらくは、コミット速度を優先するためにgit-hooksなどでコミット時に自動で走るように設定しないので、
# 気が向いたときに走らせてください
npm run lint
```

## Firestoreの設計
[こちらを御覧ください](docs/firestore.md)

## Firestoreのバックアップ方法
毎日3時に自動でバックアップがとられるように Cloud Functions を書いています。(functions/src/cron/auto_backup_firestore.js)
バックアップ先は Cloud Storage の`mikiwame-prod.appspot.com/firestore_backups`です。

### 復元方法
データ操作をミスった場合などは、GCPのコンソールでCloud Shellを開き、以下のコマンドを入力してください。
```shell
# e.g. 2020年1月1日01:23のバックアップを復元したい場合
gcloud firestore import gs://mikiwame-prod.appspot.com/firestore_backups/202001010123
```

### 手動バックアップ
GCPのコンソールでCloud Shellを開き、以下のコマンドを入力してください。
```shell
# e.g. 2020年1月1日01:23にバックアップを取る場合
gcloud firestore export gs://mikiwame-prod.appspot.com/firestore_backups/202001010123
```

## Firebase Authentication
毎日3時に自動でバックアップがとられるように Cloud Functions を書いています。(functions/src/cron/auto_backup_auth.js.js)  
バックアップ先は Cloud Storage の`mikiwame-prod.appspot.com/auth_backups`です。  
手動のバックアップ、復元方法は[こちら](https://yutaabe200.hatenablog.com/entry/2019/02/15/Firebase_Authentication%E3%81%AEinport/export)を
