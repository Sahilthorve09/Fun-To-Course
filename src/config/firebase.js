import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAReKa8lrz9dRml3carPy2VinFJgRIsRgE",
  authDomain: "fun-to-course.firebaseapp.com",
  projectId: "fun-to-course",
  storageBucket: "fun-to-course.firebasestorage.app",
  messagingSenderId: "168137042458",
  appId: "1:168137042458:web:3ee7ca18be70a0dca93fa3",
  measurementId: "G-SDC7WPHYWP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app; 