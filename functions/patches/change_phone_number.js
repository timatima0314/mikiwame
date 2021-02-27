const { admin } = require('./utils/admin')

async function main() {
  const beforePhoneNumber = ''
  const afterPhoneNumber = ''

  const user = await admin.auth().getUserByPhoneNumber(beforePhoneNumber)
  console.log(user.uid)
  admin.auth().updateUser(user.uid, { phoneNumber: afterPhoneNumber })
}

main()