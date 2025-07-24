import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "你的",
    authDomain: "你的",
    projectId: "你的",
    storageBucket: "你的",
    messagingSenderId: "你的",
    appId: "你的"
};

// 初始化 Firebase App
const app = initializeApp(firebaseConfig);

// 輸出 Firestore 實例
export const db = getFirestore(app);