const functions = require("firebase-functions");
const { admin } = require("../../plugins/admin");
const { getTalentDocumentRefByIds } = require("../util");

/*
推薦の登録完了
- Authから推薦者を削除
- 推薦者の完了日を登録
- 候補者の推薦状況ステータスを更新
*/

/**
 * @typedef Props
 * @property {string} uid
 * @property {string} companyId
 * @property {string} talentId
 * @property {string} refereeId
 * @property {boolean} awakeRun
 */

exports.completeReferenceCheck = functions
  .region("asia-northeast1")
  .https.onCall(
    /** @param {Props} data */
    async ({ uid, companyId, talentId, refereeId, awakeRun }) => {
      if (awakeRun) return null;

      const talentDocumentRef = getTalentDocumentRefByIds(companyId, talentId);
      const refereeDocumentRef = talentDocumentRef
        .collection("referees")
        .doc(refereeId);

      try {
        // 推薦者の電話番号をauthから削除
        await admin.auth().deleteUser(uid);

        // 推薦者の完了日を現在日時で登録
        await refereeDocumentRef.update({
          completedAt: new Date().toJSON()
        });

        // 候補者の回答ステータスを完了にする
        // TODO: 複数人いたら完了にしない
        // #26
        await talentDocumentRef.update({
          status: "refereesAnswered"
        });

      } catch (error) {
        functions.logger.error(error);
      }
    }
  );
