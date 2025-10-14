import React from 'react';
import { ScrollView, Text } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import TermCard from '../../components/TermCard';
import { getFavoritesSet, toggleFavorite } from '../../services/terms';

export default function Favorites(){
  const [terms, setTerms] = React.useState([]);
  const [favSet, setFavSet] = React.useState(new Set());

  React.useEffect(()=>{
    (async ()=>{
      const snap = await getDocs(collection(db, 'termos'));
      const arr = snap.docs.map(d => ({ id:d.id, ...(d.data()) }));
      const set = await getFavoritesSet(auth.currentUser?.uid);
      setTerms(arr.filter(t => set.has(t.id)));
      setFavSet(set);
    })();
  },[]);

  async function handleToggleFav(id){
    const uid = auth.currentUser?.uid;
    const set = new Set(favSet);
    const newVal = !set.has(id);
    if(newVal) set.add(id); else set.delete(id);
    setFavSet(set);
    await toggleFavorite(uid, id, newVal);
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#F9FAFB', padding:16 }}>
      {terms.length === 0 ? <Text style={{ textAlign:'center', marginTop:20, color:'#6B7280' }}>Nenhum favorito ainda.</Text> :
        terms.map(t => (
          <TermCard key={t.id} term={t} isFav={favSet.has(t.id)} onToggleFav={()=>handleToggleFav(t.id)} />
        ))
      }
    </ScrollView>
  );
}
