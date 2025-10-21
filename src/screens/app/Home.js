// src/screens/Home.js
import React from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native'
import Card from '../../components/Card'
import TermCard from '../../components/TermCard'
import { db, auth } from '../../services/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { toggleFavorite, getFavoritesSet } from '../../services/terms'

export default function Home({ navigation }) {
  const [search, setSearch] = React.useState('')
  const [terms, setTerms] = React.useState([])
  const [favSet, setFavSet] = React.useState(new Set())

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      const snap = await getDocs(collection(db, 'termos'))
      const arr = snap.docs.map((d) => ({ id: d.id, ...(d.data()) }))
      if (!mounted) return
      setTerms(arr)

      const uid = auth.currentUser?.uid
      const favs = await getFavoritesSet(uid)
      if (!mounted) return
      setFavSet(favs)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = terms.filter((t) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (t.cientifico || '').toLowerCase().includes(q) ||
      (t.populares || []).some((p) => (p || '').toLowerCase().includes(q))
    )
  })

  const stats = {
    total: terms.length,
    verificados: terms.filter((t) => t.status === 'Verificado').length,
    favoritos: filtered.filter((t) => favSet.has(t.id)).length,
  }

  async function handleToggleFav(id) {
    const uid = auth.currentUser?.uid
    const next = new Set(favSet)
    const willFav = !next.has(id)
    if (willFav) next.add(id)
    else next.delete(id)
    setFavSet(next)
    await toggleFavorite(uid, id, willFav)
  }

  function openDetails(term) {
    navigation.navigate('TermDetails', {
      termId: term.id,
      term, // para render imediato na tela de detalhes
    })
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#2D1C87' }}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View style={{ height: 36 }} />

      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.searchWrap}>
          <TextInput
            placeholder="Pesquisar"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1 }}
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
        <Card>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Estatísticas de Termos</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text>Total</Text>
              <Text style={styles.stat}>{stats.total}</Text>
            </View>
            <View>
              <Text>Verificados</Text>
              <Text style={styles.stat}>{stats.verificados}</Text>
            </View>
            <View>
              <Text>Favoritos</Text>
              <Text style={styles.stat}>{stats.favoritos}</Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Termos Recentes</Text>
        {filtered.length === 0 ? (
          <Card>
            <Text style={{ textAlign: 'center', color: '#6B7280' }}>
              Ainda não há informações para exibir
            </Text>
          </Card>
        ) : (
          filtered.map((t) => (
            <TermCard
              key={t.id}
              term={t}
              isFav={favSet.has(t.id)}
              onToggleFav={() => handleToggleFav(t.id)}
              onPress={() => openDetails(t)}
            />
          ))
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  searchWrap: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
  },
  stat: { fontSize: 20, fontWeight: '800' },
})
