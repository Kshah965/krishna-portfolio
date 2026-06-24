import { initializeApp } from 'firebase/app';
import { getDatabase, ref, runTransaction, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBvl6Vc-Gk4slMQhwS7dcxuOVRqgHuEwmM",
  authDomain: "krishnaportfolio-f6d93.firebaseapp.com",
  projectId: "krishnaportfolio-f6d93",
  storageBucket: "krishnaportfolio-f6d93.firebasestorage.app",
  messagingSenderId: "441151480669",
  appId: "1:441151480669:web:05ee38806ddc35d3aa7eb4",
  measurementId: "G-D2V35PVETW",
  databaseURL: "https://krishnaportfolio-f6d93-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function incrementVisitor() {
  const counterRef = ref(db, 'visitors/count');
  await runTransaction(counterRef, (current) => (current || 0) + 1);
}

export function subscribeToCount(callback) {
  const counterRef = ref(db, 'visitors/count');
  const unsub = onValue(counterRef, snap => callback(snap.val() || 0));
  return unsub;
}
