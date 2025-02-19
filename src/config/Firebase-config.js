// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeiYlx3zJBurJWQNh4StVMjkVkTsQ1oHA",
  authDomain: "tradinglog-c4fa2.firebaseapp.com",
  projectId: "tradinglog-c4fa2",
  storageBucket: "tradinglog-c4fa2.firebasestorage.app",
  messagingSenderId: "320091142237",
  appId: "1:320091142237:web:597b477f245e4f8f22f5b4",
  measurementId: "G-4289RFGFW7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);