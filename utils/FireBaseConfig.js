
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBdLjK5vATKjxbr5QhMIQJHpg5FjWK7dOE",
  authDomain: "oulearning-22861.firebaseapp.com",
  databaseURL: "https://oulearning-22861-default-rtdb.firebaseio.com",
  projectId: "oulearning-22861",
  storageBucket: "oulearning-22861.firebasestorage.app",
  messagingSenderId: "931618240110",
  appId: "1:931618240110:web:dfe834cc432ccf6814d87f",
  measurementId: "G-LYG9F68PWF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getDatabase(app); 

if (db) {
    console.log("Firebase: Kết nối thành công!");
} else {
    console.error("Lỗi kết nối Firebase!");
}

export { db };