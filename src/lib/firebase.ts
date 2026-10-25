import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDbLiGCFO1xPhM7YpzMpu1gJK0wwDzPqdI",
  authDomain: "stajly.firebaseapp.com",
  projectId: "stajly",
  storageBucket: "stajly.firebasestorage.app",
  messagingSenderId: "651689745768",
  appId: "1:651689745768:web:1901b3609a952d95500add",
  measurementId: "G-H1JF0H88M7"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)