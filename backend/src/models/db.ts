const admin = require('firebase-admin')

let serviceAccount = require('../../happy-nanny-11d71-firebase-adminsdk-dk8k5-683bb7bc89.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://happy-nanny-11d71.firebaseio.com"
})

const db = admin.firestore()
const adminFirestoreFieldValue = admin.firestore.FieldValue

export {
  db,
  adminFirestoreFieldValue
}
