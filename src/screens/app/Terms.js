import React from 'react';
import { View, TextInput, ScrollView, AppState, Platform, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/firebase';
import TermCard from '../../components/TermCard';
import { getFavoritesSet, toggleFavorite, getTerms } from '../../services/terms';

export default function Terms(){
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');
  const [terms, setTerms] = React.useState([]);
  const [favSet, setFavSet] = React.useState(new Set());
  const [showFilters, setShowFilters] = React.useState(false);
  const [orderBy, setOrderBy] = React.useState('recent'); // 'relevant' ou 'recent'
  const [selectedArea, setSelectedArea] = React.useState('Todos');
  const [selectedCategories, setSelectedCategories] = React.useState([]);

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

  // Recarregar favoritos quando a tela receber foco
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const uid = auth.currentUser?.uid;
      const favs = await getFavoritesSet(uid);
      setFavSet(favs);
    });

    return unsubscribe;
  }, [navigation]);

  const filtered = terms.filter(t => {
    // Filtro de busca
    const matchesSearch = !search || 
      (t.cientifico||'').toLowerCase().includes(search.toLowerCase()) || 
      (t.populares||[]).some(p=>(p||'').toLowerCase().includes(search.toLowerCase()));
    
    if (!matchesSearch) return false;

    // Filtro de área
    if (selectedArea !== 'Todos') {
      const termAreas = t.tags || t.areas || t.area || [];
      const areaMatch = Array.isArray(termAreas) 
        ? termAreas.includes(selectedArea)
        : termAreas === selectedArea;
      
      if (!areaMatch) return false;
    }

    // Filtro de categoria
    if (selectedCategories.length > 0) {
      const termCategory = t.categoria || '';
      const termTags = t.tags || t.areas || [];
      
      const categoryMatch = selectedCategories.some(cat => 
        termCategory === cat || 
        (Array.isArray(termTags) && termTags.includes(cat))
      );
      
      if (!categoryMatch) return false;
    }

    return true;
  });

  // Ordenar os resultados filtrados
  const sortedFiltered = [...filtered].sort((a, b) => {
    if (orderBy === 'recent') {
      // Assumindo que termos têm um campo 'createdAt' ou similar
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    } else {
      // Para relevância, pode ordenar por favoritos, visualizações, etc.
      return 0;
    }
  });

  // Áreas e categorias únicas dos termos
  const areas = ['Todos', ...new Set(terms.flatMap(t => t.tags || t.areas || []))];
  const categories = [...new Set(terms.flatMap(t => t.categoria ? [t.categoria] : (t.tags || t.areas || [])))];

  function applyFilters() {
    setShowFilters(false);
  }

  function cancelFilters() {
    setOrderBy('recent');
    setSelectedArea('Todos');
    setSelectedCategories([]);
    setShowFilters(false);
  }

  function toggleCategory(category) {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }

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
    <View style={styles.container}>
      {/* Header roxo */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Todos os Termos</Text>
            <Text style={styles.headerSubtitle}>{sortedFiltered.length} de {terms.length} termos</Text>
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
            <Ionicons name="options-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput 
            placeholder='Pesquisar' 
            placeholderTextColor='#9CA3AF' 
            value={search} 
            onChangeText={setSearch} 
            style={styles.searchInput} 
          />
        </View>
        <View style={styles.termsList}>
          {sortedFiltered.map(t => (
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

      {/* Modal de Filtros */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtros</Text>

            {/* Ordenar por */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Ordenar por</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity
                  style={[styles.filterOption, orderBy === 'relevant' && styles.filterOptionActive]}
                  onPress={() => setOrderBy('relevant')}
                >
                  <Text style={[styles.filterOptionText, orderBy === 'relevant' && styles.filterOptionTextActive]}>
                    Mais relevantes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterOption, orderBy === 'recent' && styles.filterOptionActive]}
                  onPress={() => setOrderBy('recent')}
                >
                  <Text style={[styles.filterOptionText, orderBy === 'recent' && styles.filterOptionTextActive]}>
                    Mais recentes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Área */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Área</Text>
              <View style={styles.areaOptions}>
                <TouchableOpacity
                  style={[styles.filterOption, selectedArea === 'Todos' && styles.filterOptionActive]}
                  onPress={() => setSelectedArea('Todos')}
                >
                  <Text style={[styles.filterOptionText, selectedArea === 'Todos' && styles.filterOptionTextActive]}>
                    Todos
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterOption, selectedArea === 'Medicina' && styles.filterOptionActive]}
                  onPress={() => setSelectedArea('Medicina')}
                >
                  <Text style={[styles.filterOptionText, selectedArea === 'Medicina' && styles.filterOptionTextActive]}>
                    Medicina
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterOption, selectedArea === 'Odontologia' && styles.filterOptionActive]}
                  onPress={() => setSelectedArea('Odontologia')}
                >
                  <Text style={[styles.filterOptionText, selectedArea === 'Odontologia' && styles.filterOptionTextActive]}>
                    Odontologia
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Categoria */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Categoria</Text>
              <View style={styles.categoryOptions}>
                {categories.slice(0, 7).map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.categoryChip, selectedCategories.includes(category) && styles.categoryChipActive]}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text style={[styles.categoryChipText, selectedCategories.includes(category) && styles.categoryChipTextActive]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Botões */}
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelFilters}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#2D1C87',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  termsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  areaOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    minWidth: '30%',
  },
  filterOptionActive: {
    backgroundColor: '#2D1C87',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
  },
  categoryChipActive: {
    backgroundColor: '#2D1C87',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#2D1C87',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D1C87',
  },
  cancelButtonText: {
    color: '#2D1C87',
    fontSize: 16,
    fontWeight: '700',
  },
});
