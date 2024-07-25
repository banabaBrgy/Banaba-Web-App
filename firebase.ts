import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAPwjtsjq0f18f8Wlw3HvqVv-ARngPAsis",
  authDomain: "barangay-banaba-east-54990.firebaseapp.com",
  projectId: "barangay-banaba-east-54990",
  storageBucket: "barangay-banaba-east-54990.appspot.com",
  messagingSenderId: "117762055501",
  appId: "1:117762055501:web:7e3e2df1e6f54100a46b04",
  measurementId: "G-EZY4S08BF5",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };
