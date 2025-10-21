import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function getTerms() {
  const snap = await getDocs(collection(db, 'termos'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data()) }));
}

export async function getFavoritesSet(uid) {
  try {
    if (!uid) return new Set();

    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    
    if (!snap.exists()) {
      // Criar documento do usuário se não existir
      await setDoc(ref, { favorites: [] });
      return new Set();
    }

    const favorites = snap.data()?.favorites || [];
    return new Set(favorites);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    return new Set();
  }
}

export async function toggleFavorite(uid, termId, isFav) {
  try {
    if (!uid) return false;

    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    
    let currentFavorites = [];
    if (snap.exists()) {
      currentFavorites = snap.data()?.favorites || [];
    }

    const favoritesSet = new Set(currentFavorites);
    if (isFav) {
      favoritesSet.add(termId);
    } else {
      favoritesSet.delete(termId);
    }

    await setDoc(ref, {
      favorites: Array.from(favoritesSet),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return true;
  } catch (error) {
    console.error('Erro ao atualizar favorito:', error);
    return false;
  }
}
