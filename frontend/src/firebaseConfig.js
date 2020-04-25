import firebase from 'firebase'
import 'firebase/firestore'

// Firebase config goes here
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

const auth = firebase.auth()
const currentUser = auth.currentUser

export {
  auth,
  currentUser,
}