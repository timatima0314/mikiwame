const functions = require('firebase-functions')
const firebaseTools = require('firebase-tools')
const { bucket } = require('../plugins/admin')
const { dayjs } = require('../plugins/localized_dayjs')

const BACKUP_MAX_AGE = 10 // 日前までのバックアップは保存しておき、これよりも古いものは削除。

/**
 * Firebase Auth のデータを自動バックアップする
 */
module.exports = functions
  .region('asia-northeast1') // 東京リージョン
  .pubsub
  .schedule('every day 3:00') // 利用者がいなさそうな午前3時に
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
    /* global process */
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT

    // 古いバックアップを削除する処理
    const expiredDate = dayjs().subtract(BACKUP_MAX_AGE + 1, 'days') // BACKUP_MAX_AGE+１ 日前のバックアップファイル
    // バックアップを取る時間は数分の誤差がでるため、日付をprefixとして検索する
    const [expiredFiles] = await bucket.getFiles({ prefix: `auth_backups/${expiredDate.format('YYYYMMDD')}` })
    await Promise.all(expiredFiles.map(file => file.delete()))

    const backupFilename = `${dayjs().format('YYYYMMDDHHmm')}.csv`
    // cloud functionsで読み書きできるのは /tmp ディレクトリのみ https://cloud.google.com/functions/docs/concepts/exec?hl=ja#file_system
    const tmpSavedPath = `/tmp/${backupFilename}`

    await firebaseTools.auth.export(tmpSavedPath, { project: projectId })
    return bucket.upload(tmpSavedPath, { destination: `auth_backups/${backupFilename}` })
  })
