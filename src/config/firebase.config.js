import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "facilities-booker.firebaseapp.com",
  projectId: "facilities-booker",
  storageBucket: "facilities-booker.appspot.com",
  messagingSenderId: "301533627094",
  appId: "1:301533627094:web:e63ae722e957bb6c9f3f77",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
