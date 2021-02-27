module.exports = {
  silent: false,
  verbose: false,
  testTimeout: 10000,
  // avoid error when connectiong firestore
  // https://github.com/firebase/firebase-admin-node/issues/793#issuecomment-592334797
  testPathIgnorePatterns: ['lib/', 'node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node'
}
