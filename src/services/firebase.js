import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { initializeAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCpemY_iGcwMRVCI0Zi9_pXpFnevYund1U",
  authDomain: "gerenciador-web-admin.firebaseapp.com",
  projectId: "gerenciador-web-admin",
  storageBucket: "gerenciador-web-admin.appspot.com",
  messagingSenderId: "156926606491",
  appId: "1:156926606491:web:84af4a3d92837d439a1a3e",
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

if (!globalThis.__AUTH_INSTANCE__) {
  // Fallback: initialize auth without React Native persistence.
  // This uses in-memory persistence (won't persist between app restarts).
  globalThis.__AUTH_INSTANCE__ = initializeAuth(app)
}

export const auth = globalThis.__AUTH_INSTANCE__
export const db = getFirestore(app)
