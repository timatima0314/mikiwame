const { admin } = require("./utils/admin");

const main = async () => {
  const refereesSnapshot = await admin
    .firestore()
    .collectionGroup("referees")
    .get();

  refereesSnapshot.forEach(async refereeDoc => {
    const referee = refereeDoc.data();
    if (!referee.phoneNumber) return;
    console.log("referee", referee.phoneNumber);
    await refereeDoc.ref.update({
      phoneNumber: `+81${referee.phoneNumber.slice(1)}`
    });
  });
};

main();
