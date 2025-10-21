import React from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { auth } from '../../services/firebase';
import TermCard from '../../components/TermCard';
import { getFavoritesSet, toggleFavorite, getTerms } from '../../services/terms';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function Favorites(){
  const navigation = useNavigation();
  const [terms, setTerms] = React.useState([]);
  const [favSet, setFavSet] = React.useState(new Set());
  const [loading, setLoading] = React.useState(true);

  const loadFavorites = React.useCallback(async () => {
    try {
      setLoading(true);
      const [allTerms, favoritesSet] = await Promise.all([
        getTerms(),
        getFavoritesSet(auth.currentUser?.uid)
      ]);
      
      // Filtra apenas os termos que estão nos favoritos
      const favoriteTerms = allTerms.filter(term => favoritesSet.has(term.id));
      setTerms(favoriteTerms);
      setFavSet(favoritesSet);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega os favoritos toda vez que a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  async function handleToggleFav(id){
    const uid = auth.currentUser?.uid;
    const set = new Set(favSet);
    const newVal = !set.has(id);
    
    // Atualiza imediatamente a UI
    if(newVal) {
      set.add(id);
    } else {
      set.delete(id);
      // Remove o termo da lista se foi desfavoritado
      setTerms(currentTerms => currentTerms.filter(t => t.id !== id));
    }
    setFavSet(set);

    // Atualiza no banco de dados
    await toggleFavorite(uid, id, newVal);
  }

  function handleTermPress(term) {
    navigation.navigate('TermDetails', { termId: term.id, term });
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16 }}
      contentContainerStyle={{ 
        flexGrow: 1, 
        ...(terms.length === 0 && { justifyContent: 'center' }) 
      }}
    >
      {terms.length === 0 ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ 
            textAlign: 'center', 
            color: '#6B7280',
            fontSize: 16,
            marginBottom: 8 
          }}>
            Nenhum favorito ainda.
          </Text>
          <Text style={{ 
            textAlign: 'center', 
            color: '#9CA3AF',
            fontSize: 14 
          }}>
            Adicione termos aos favoritos para vê-los aqui.
          </Text>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {terms.map(t => (
            <TermCard 
              key={t.id} 
              term={t} 
              isFav={favSet.has(t.id)} 
              onToggleFav={() => handleToggleFav(t.id)}
              onPress={() => handleTermPress(t)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
