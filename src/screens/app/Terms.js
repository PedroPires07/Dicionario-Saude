import React from 'react';
import { View, TextInput, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import TermCard from '../../components/TermCard';
import { getFavoritesSet, toggleFavorite } from '../../services/terms';

export default function Terms(){
  const [search, setSearch] = React.useState('');
  const [terms, setTerms] = React.useState([]);
  const [favSet, setFavSet] = React.useState(new Set());

  React.useEffect(()=>{
    (async ()=>{
      const snap = await getDocs(collection(db, 'termos'));
      const arr = snap.docs.map(d => ({ id:d.id, ...(d.data()) }));
      setTerms(arr);
      setFavSet(await getFavoritesSet(auth.currentUser?.uid));
    })();
  },[]);

  const filtered = terms.filter(t => !search || (t.cientifico||'').toLowerCase().includes(search.toLowerCase()) || (t.populares||[]).some(p=>(p||'').toLowerCase().includes(search.toLowerCase())));

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
      <View style={{ backgroundColor:'#fff', borderRadius:10, paddingHorizontal:12, height:44, justifyContent:'center' }}>
        <TextInput placeholder='Pesquisar' placeholderTextColor='#9CA3AF' value={search} onChangeText={setSearch} style={{ flex:1 }} />
      </View>
      <View style={{ marginTop:12 }}>
        {filtered.map(t => (
          <TermCard key={t.id} term={t} isFav={favSet.has(t.id)} onToggleFav={()=>handleToggleFav(t.id)} />
        ))}
      </View>
    </ScrollView>
  );
}
