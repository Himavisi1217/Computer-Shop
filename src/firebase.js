// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA0Xnfn39NWTndGYAeUR6ycbNosEi-BawQ',
  authDomain: 'computer-shop-e2359.firebaseapp.com',
  projectId: 'computer-shop-e2359',
  storageBucket: 'computer-shop-e2359.appspot.com',
  messagingSenderId: '507155417325',
  appId: 'G-4F32E037GF'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore };