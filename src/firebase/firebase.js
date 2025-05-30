// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  GoogleAuthProvider, 
  GithubAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to sign up a user with email and password
const signUpWithEmail = async (email, password, firstName, lastName, phoneNumber) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      email,
      phoneNumber,
      createdAt: new Date(),
    });

    return user; // Return the signed-up user
  } catch (error) {
    throw error; // Throw the error to handle it in the component
  }
};

const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user; // Return the signed-in user
  } catch (error) {
    throw error; // Throw the error to handle it in the component
  }
};

// Function to sign up or log in with Google
const signUpWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  // Request email scope
  provider.addScope('email');
  
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userEmail = user.email || user.providerData[0]?.email || "No email provided";
    
    // Check if the user document already exists
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    // Only create a new document if the user doesn't exist
    if (!userDoc.exists()) {
      const displayName = user.displayName || "";
      const [firstName, lastName] = displayName.split(" ");
      
      // Store user data in Firestore only for new users
      await setDoc(userDocRef, {
        firstName: firstName || "N/A",
        lastName: lastName || "N/A",
        email: userEmail,
        phoneNumber: "N/A",
        createdAt: new Date(),
        provider: "google" // Add provider information
      });
    }

    return {
      ...user,
      email: userEmail
    };
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Function to sign up or log in with GitHub
const signUpWithGitHub = async () => {
  const provider = new GithubAuthProvider();
  // Request email scope
  provider.addScope('user:email');
  
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userEmail = user.email || user.providerData[0]?.email || "No email provided";
    
    // Check if the user document already exists
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    // Only create a new document if the user doesn't exist
    if (!userDoc.exists()) {
      const displayName = user.displayName || "";
      const [firstName, lastName] = displayName.split(" ");
      
      // Store additional user data in Firestore only for new users
      await setDoc(userDocRef, {
        firstName: firstName || "N/A",
        lastName: lastName || "N/A",
        email: userEmail,
        phoneNumber: "N/A", 
        createdAt: new Date(),
        provider: "github" // Add provider information
      });
    }

    return {
      ...user,
      email: userEmail
    };
  } catch (error) {
    console.error("GitHub sign-in error:", error);
    throw error;
  }
};

export { app, analytics, auth, db, 
  signUpWithEmail, 
  signUpWithGoogle,
  signUpWithGitHub,
  signInWithEmail
 };

