const { admin } = require("./utils/admin");
/**
 * 候補者データをdbから書き出すスクリプト
 * @see https://firebase.google.com/docs/admin/setup?hl=ja
 * @run
 * ```
 * $ export GOOGLE_APPLICATION_CREDENTIALS='path/to/credentisl.json'
 * $ node add_config_data_to_companies.js
 * ```
 */

const companyId = "";
const talentId = "";

const main = async () => {
  admin
    .firestore()
    .doc("/company_version/1/")
    .collection("companies")
    .doc(companyId)
    .collection("talents")
    .doc(talentId)
    .get()
    .then(talentSS => {
      const data = talentSS.data();
      const json = JSON.stringify(data, null, 2);
      console.log(json);
    });

  admin
    .firestore()
    .doc("/company_version/1/")
    .collection("companies")
    .doc(companyId)
    .collection("talents")
    .doc(talentId)
    .collection("referees")
    .get()
    .then(refereesSS => {
      refereesSS.forEach(refereeDoc => {
        const data = refereeDoc.data();
        const json = JSON.stringify(data, null, 2);
        console.log(json);
      });
    });
};

main();
