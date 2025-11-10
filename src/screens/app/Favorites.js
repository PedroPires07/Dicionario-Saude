// src/screens/Favorites.js
import React from 'react'
import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { Platform } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { auth } from '../../services/firebase'
import TermCard from '../../components/TermCard'
import { getFavoritesSet, toggleFavorite, getTerms } from '../../services/terms'

export default function Favorites() {
  const navigation = useNavigation()
  const [terms, setTerms] = React.useState([])
  const [favSet, setFavSet] = React.useState(new Set())
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  const loadFavorites = React.useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const uid = auth.currentUser?.uid
      if (!uid) {
        // sem login: não tenta consultar; limpa estado e sai
        setTerms([])
        setFavSet(new Set())
        return
      }

      // carrega termos e o conjunto de favoritos do usuário
      const [allTerms, favoritesSet] = await Promise.all([
        getTerms(),
        getFavoritesSet(uid),
      ])

      const favoriteTerms = allTerms.filter((t) => favoritesSet.has(t.id))
      setTerms(favoriteTerms)
      setFavSet(favoritesSet)
    } catch (e) {
      console.error('Erro ao carregar favoritos:', e)
      setError(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  // recarrega sempre que a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      loadFavorites()
    }, [loadFavorites])
  )

  async function handleToggleFav(id) {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const next = new Set(favSet)
    const willFav = !next.has(id)

    // atualização otimista da UI
    if (willFav) {
      next.add(id)
    } else {
      next.delete(id)
      setTerms((curr) => curr.filter((t) => t.id !== id))
    }
    setFavSet(next)

    try {
      await toggleFavorite(uid, id, willFav)
    } catch (e) {
      // rollback simples em caso de erro
      if (willFav) next.delete(id)
      else next.add(id)
      setFavSet(new Set(next))
      console.error('Erro ao atualizar favorito:', e)
    }
  }

  function handleTermPress(term) {
    navigation.navigate('TermDetails', { termId: term.id, term })
  }

  // loading
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    )
  }

  // sem login
  if (!auth.currentUser) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ textAlign: 'center', color: '#6B7280', fontSize: 16, marginBottom: 8 }}>
          Faça login para ver seus favoritos.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={{ marginTop: 8 }}>
          <Text style={{ color: '#4F46E5', fontWeight: '700' }}>Ir para Login</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // erro (ex.: regras)
  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ textAlign: 'center', color: '#DC2626' }}>
          Erro ao carregar favoritos: {error}
        </Text>
        <TouchableOpacity onPress={loadFavorites} style={{ marginTop: 12 }}>
          <Text style={{ color: '#4F46E5', fontWeight: '700' }}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // lista
  return (
    <View style={styles.container}>
      {/* Header roxo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <Text style={styles.headerSubtitle}>Seus termos salvos aparecerão aqui</Text>
      </View>

      {/* Conteúdo */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          flexGrow: 1,
          ...(terms.length === 0 && { justifyContent: 'center', alignItems: 'center' }),
        }}
      >
        {terms.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart-outline" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.emptyTitle}>Você ainda não tem favoritos</Text>
            <Text style={styles.emptySubtitle}>
              Marque seus termos preferidos como favoritos para acessá-los rapidamente
            </Text>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.buttonText}>Explorar termos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ padding: 16, gap: 12 }}>
            {terms.map((t) => (
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#2D1C87',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#2D1C87',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2D1C87',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
