import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Safely load config from Vite environment variables or fallback to hardcoded placeholders
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Config Debug Logging
console.log("🔥 FIREBASE INIT: Checking Configuration...");

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
  console.error("🔥 FIREBASE ERROR: API Key is missing or invalid! Did you create a .env file?");
} else {
  console.log(`🔥 FIREBASE OK: API Key loaded (starts with ${firebaseConfig.apiKey.substring(0, 5)}...)`);
}

// Ensure initializeApp is only called ONCE
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
console.log("🔥 FIREBASE INIT: App Initialized successfully.");
console.log("🔥 FIREBASE CONFIG DUMP:", {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 5)}...${firebaseConfig.apiKey.substring(firebaseConfig.apiKey.length - 4)}` : undefined
});
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { RecaptchaVerifier };
