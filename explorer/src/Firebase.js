import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHEBCc0UvXC1Qt5WZvCrwtPS-EyQHoZd8",
  authDomain: "github-expoxler.firebaseapp.com",
  projectId: "github-expoxler",
  storageBucket: "github-expoxler.appspot.com",
  messagingSenderId: "930061828551",
  appId: "1:930061828551:web:2215d5f9206845c33219e2",
  databaseURL: "https://github-expoxler-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
