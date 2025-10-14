import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


export const firebaseConfig = {
  apiKey: "AIzaSyCpemY_iGcwMRVCI0Zi9_pXpFnevYund1U",
  authDomain: "gerenciador-web-admin.firebaseapp.com",
  projectId: "gerenciador-web-admin",
  storageBucket: "gerenciador-web-admin.firebasestorage.app",
  messagingSenderId: "156926606491",
  appId: "1:156926606491:web:84af4a3d92837d439a1a3e",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
