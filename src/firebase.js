import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app, auth, db, googleProvider;
if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
}

export const firebaseConfigured = isConfigured;

export const signInGoogle = async () => {
  if (!isConfigured) return null;
  return signInWithPopup(auth, googleProvider);
};

export const logOut = async () => {
  if (!isConfigured) return;
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  if (!isConfigured) return () => {};
  return onAuthStateChanged(auth, callback);
};

export const cloudSaveData = async (uid, key, data) => {
  if (!isConfigured || !uid) return;
  try {
    await setDoc(doc(db, 'users', uid, 'data', key), { value: data, updatedAt: Date.now() });
  } catch (e) {
    console.error('Cloud save error:', e);
  }
};

export const cloudLoadData = async (uid, key) => {
  if (!isConfigured || !uid) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'data', key));
    return snap.exists() ? snap.data().value : null;
  } catch (e) {
    console.error('Cloud load error:', e);
    return null;
  }
};
