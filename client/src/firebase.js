// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-add73.firebaseapp.com",
  projectId: "mern-estate-add73",
  storageBucket: "mern-estate-add73.firebasestorage.app",
  messagingSenderId: "1086858461726",
  appId: "1:1086858461726:web:d8a36d46dac2211f3d240f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
