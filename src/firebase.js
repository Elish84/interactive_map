import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0KsYdCuY-FZXzR1bvMryRFWEpEHXx7-o",
  authDomain: "tripai-424f0.firebaseapp.com",
  projectId: "tripai-424f0",
  storageBucket: "tripai-424f0.firebasestorage.app",
  messagingSenderId: "181896855428",
  appId: "1:181896855428:web:b6a872448206f9ebbda7d1",
  measurementId: "G-RZTVM1YMHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
