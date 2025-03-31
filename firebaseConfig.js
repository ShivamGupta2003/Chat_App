// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZy4Q-kgSL6aKhfQ1VrWhoT4TISkQ48Bw",
  authDomain: "fir-chatapp-e6073.firebaseapp.com",
  projectId: "fir-chatapp-e6073",
  storageBucket: "fir-chatapp-e6073.firebasestorage.app",
  messagingSenderId: "117925430360",
  appId: "1:117925430360:web:e4b839e0c4905d68bcf62d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const usersRef = collection(db, "users");
export const roomRef = collection(db, "rooms");
