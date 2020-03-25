// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9TNUobFvMuCcOYu35-0oWwSqCrLrNvis",
    authDomain: "happy-nanny-11d71.firebaseapp.com",
    databaseURL: "https://happy-nanny-11d71.firebaseio.com",
    projectId: "happy-nanny-11d71",
    storageBucket: "happy-nanny-11d71.appspot.com",
    messagingSenderId: "626590299693",
    appId: "1:626590299693:web:1b9a9247704fcb4e576aa4",
    measurementId: "G-QG1RB4Y86S"
  };
  
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase