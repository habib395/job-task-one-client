// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkis9vUuqoQelmpuQStRmh1VRRuPv0Y_8",
  authDomain: "job-task-one-8e6d1.firebaseapp.com",
  projectId: "job-task-one-8e6d1",
  storageBucket: "job-task-one-8e6d1.firebasestorage.app",
  messagingSenderId: "1059608504985",
  appId: "1:1059608504985:web:71819c4f415d771e4d2608"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export default auth