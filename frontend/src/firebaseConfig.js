import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
  apiKey: "AIzaSyB9TNUobFvMuCcOYu35-0oWwSqCrLrNvis",
  authDomain: "happy-nanny-11d71.firebaseapp.com",
  databaseURL: "https://happy-nanny-11d71.firebaseio.com",
  projectId: "happy-nanny-11d71",
  storageBucket: "happy-nanny-11d71.appspot.com",
  messagingSenderId: "626590299693",
  appId: "1:626590299s693:web:1b9a9247704fcb4e576aa4",
  measurementId: "G-QG1RB4Y86S"
}

firebase.initializeApp(config)

// firebase utils
// const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
// const settings = {
//   timestampsInSnapshots: true
// }
// db.settings(settings)

// firebase collections
// const usersCollection = db.collection('users')
// const postsCollection = db.collection('posts')
// const commentsCollection = db.collection('comments')
// const likesCollection = db.collection('likes')

export {
  // db,
  auth,
  currentUser,
  // usersCollection,
  // postsCollection,
  // commentsCollection,
  // likesCollection
}