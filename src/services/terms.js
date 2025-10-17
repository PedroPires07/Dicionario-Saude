import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function getFavoritesSet(uid){
  if(!uid) return new Set();
  const ref = doc(db, 'profiles', uid);
  const snap = await getDoc(ref);
  const favs = (snap.exists() && snap.data().favorites) || [];
  return new Set(favs);
}

export async function toggleFavorite(uid, termId, isFav){
  if(!uid) return;
  const ref = doc(db, 'profiles', uid);
  const snap = await getDoc(ref);
  const cur = (snap.exists() && snap.data().favorites) || [];
  const next = new Set(cur);
  if(isFav) next.add(termId); else next.delete(termId);
  await setDoc(ref, { favorites: Array.from(next) }, { merge:true });
}
