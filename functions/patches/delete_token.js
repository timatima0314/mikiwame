const { admin } = require("./utils/admin");

/**
 * 認証が切れている場合のテスト
 * @see https://firebase.google.com/docs/admin/setup?hl=ja
 * @run
 * ```
 * $ export GOOGLE_APPLICATION_CREDENTIALS='path/to/credential.json'
 * $ node delete_token.js
 * ```
 */

const uid = "";

async function main() {
  await admin.auth().revokeRefreshTokens(uid);
  const userRecord = await admin.auth().getUser(uid);
  const timestamp = new Date(userRecord.tokensValidAfterTime).toLocaleString();
  console.log(`Tokens revoked at: ${timestamp}`);
  process.exit(0);
}

main();
