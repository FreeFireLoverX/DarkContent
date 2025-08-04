import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration, as provided.
const firebaseConfig = {
  apiKey: "AIzaSyDC2XET5v816RBN4WukWH6Y0QQfuh3HVNI",
  authDomain: "dark-content-db719.firebaseapp.com",
  projectId: "dark-content-db719",
  storageBucket: "dark-content-db719.firebasestorage.app",
  messagingSenderId: "757967372492",
  appId: "1:757967372492:web:26fdea868dbc295d5f4269",
  measurementId: "G-FME7SG291P"
};

let db;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
} catch (e) {
  db = null;
  console.error("Error initializing Firebase. Please check your configuration and ensure Firestore is enabled in your Firebase project.", e);
}

// Export the db instance. It will be null if initialization fails.
export { db };