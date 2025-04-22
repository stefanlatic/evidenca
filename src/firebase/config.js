import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCIW8OeuZOyxRbHZo7RUPR228PWJHPAYM4",
  authDomain: "evidenca-app.firebaseapp.com",
  projectId: "evidenca-app",
  storageBucket: "evidenca-app.firebasestorage.app",
  messagingSenderId: "1046048127117",
  appId: "1:1046048127117:web:c325b733157d88e287cac4",
  measurementId: "G-41K4ZD2RGC"
};

// const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);