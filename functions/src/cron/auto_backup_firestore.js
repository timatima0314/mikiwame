const functions = require('firebase-functions')
const firestore = require('@google-cloud/firestore')
const { bucket } = require('../plugins/admin')
const client = new firestore.v1.FirestoreAdminClient()
const { dayjs } = require('../plugins/localized_dayjs')

const BACKUP_MAX_AGE = 10 // 日前までのバックアップは保存しておき、これよりも古いものは削除。

/**
 * firestoreを自動バックアップする
 * 
 * cf) https://cloud.google.com/firestore/docs/solutions/schedule-export?hl=ja#create_a_cloud_function_and_a_job
 * 
 * この関数を定期実行するためには、以下の「アクセス権限を構成する」を行う必要があることに注意する。
 * https://cloud.google.com/firestore/docs/solutions/schedule-export?hl=ja#configure_access_permissions
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .pubsub
  .schedule('every day 3:00') // 利用者がいなさそうな午前3時に
  .timeZone('Asia/Tokyo')
  .onRun(async() => {
    /* global process */
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT

    // 古いバックアップを削除する処理
    const expiredDate = dayjs().subtract(BACKUP_MAX_AGE + 1, 'days') // BACKUP_MAX_AGE+１ 日前のバックアップファイル
    // バックアップを取る時間は数分の誤差がでるため、日付をprefixとして検索する
    const [expiredFiles] = await bucket.getFiles({ prefix: `firestore_backups/${expiredDate.format('YYYYMMDD')}` })
    await Promise.all(expiredFiles.map(file => file.delete()))

    const bucketPath = `gs://${bucket.name}/firestore_backups/${dayjs().format('YYYYMMDDHHmm')}`
    const databaseName = client.databasePath(projectId, '(default)')

    return client.exportDocuments({
      name: databaseName,
      outputUriPrefix: bucketPath,
      // Leave collectionIds empty to export all collections
      // or set to a list of collection IDs to export,
      // collectionIds: ['users', 'posts']
      collectionIds: []
    }).then(([response]) => {
      console.log(`Operation Name: ${response['name']}`)
    })
  })