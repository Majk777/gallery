import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDiPKqF0DlCmKwePkBj78eAEWW0ufRrHVw",
  authDomain: "thegallery-e7fd3.firebaseapp.com",
  projectId: "thegallery-e7fd3",
  storageBucket: "thegallery-e7fd3.appspot.com",
  messagingSenderId: "1012398071293",
  appId: "1:1012398071293:web:bb330fc1f141d2c2100d94",
};

firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, timestamp, projectStorage };
