// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjUYhlLBnvG5Mws7i0tWzKL13WyvofUxI",
  authDomain: "bookcatalog-ba43b.firebaseapp.com",
  projectId: "bookcatalog-ba43b",
  storageBucket: "bookcatalog-ba43b.appspot.com",
  messagingSenderId: "750998121479",
  appId: "1:750998121479:web:dab28429fc275f7dfbcea2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;