import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkeg1ew_ozWtf7tIlpFARraSXXdUYQJLo",
  authDomain: "studydev-ai-doc-55555.firebaseapp.com",
  projectId: "studydev-ai-doc-55555",
  storageBucket: "studydev-ai-doc-55555.firebasestorage.app",
  messagingSenderId: "249720972716",
  appId: "1:249720972716:web:ddbd4734d6489ce6550609"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
