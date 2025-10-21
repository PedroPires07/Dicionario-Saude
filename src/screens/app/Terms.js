import React from 'react';
import { View, TextInput, ScrollView, AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../services/firebase';
import TermCard from '../../components/TermCard';
import { getFavoritesSet, toggleFavorite, getTerms } from '../../services/terms';

export default function Terms(){
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');
  const [terms, setTerms] = React.useState([]);
  const [favSet, setFavSet] = React.useState(new Set());

  const loadTerms = React.useCallback(async () => {
    try {
      const termsData = await getTerms();
      setTerms(termsData);
      setFavSet(await getFavoritesSet(auth.currentUser?.uid));
    } catch (error) {
      console.error('Erro ao carregar termos:', error);
    }
  }, []);

  // Efeito para carregar os termos inicialmente e configurar o intervalo de atualização
  React.useEffect(() => {
    loadTerms();

    // Configurar intervalo para atualizar a cada 1 minuto
    const interval = setInterval(loadTerms, 60000);

    // Monitorar o estado do app para recarregar quando voltar do background
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        loadTerms();
      }
    });

    // Limpar intervalo e subscription quando o componente for desmontado
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [loadTerms]);

  const filtered = terms.filter(t => !search || (t.cientifico||'').toLowerCase().includes(search.toLowerCase()) || (t.populares||[]).some(p=>(p||'').toLowerCase().includes(search.toLowerCase())));

  async function handleToggleFav(id){
    const uid = auth.currentUser?.uid;
    const set = new Set(favSet);
    const newVal = !set.has(id);
    if(newVal) set.add(id); else set.delete(id);
    setFavSet(set);
    await toggleFavorite(uid, id, newVal);
  }

  function handleTermPress(term) {
    navigation.navigate('TermDetails', { termId: term.id, term });
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#F9FAFB', padding:16 }}>
      <View style={{ backgroundColor:'#fff', borderRadius:10, paddingHorizontal:12, height:44, justifyContent:'center' }}>
        <TextInput placeholder='Pesquisar' placeholderTextColor='#9CA3AF' value={search} onChangeText={setSearch} style={{ flex:1 }} />
      </View>
      <View style={{ marginTop:12 }}>
        {filtered.map(t => (
          <TermCard 
            key={t.id} 
            term={t} 
            isFav={favSet.has(t.id)} 
            onToggleFav={()=>handleToggleFav(t.id)}
            onPress={()=>handleTermPress(t)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
