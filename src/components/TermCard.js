// src/components/TermCard.js
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Card from './Card'
import { Ionicons } from '@expo/vector-icons'

/**
 * Props:
 * - term: { id, cientifico, populares[], area, categoria, atualizadoEm, tags/areas[] }
 * - isFav: boolean
 * - onToggleFav: () => void
 * - onPress: () => void   // navega para a tela de detalhes
 */
export default function TermCard({ term, isFav, onToggleFav, onPress }) {
  const chips = term?.tags || term?.areas || []

  return (
    <Card style={{ marginBottom: 12 }}>
      {/* Cabeçalho: Título/Subtítulo (clicável) + Estrela (não navega) */}
      <View style={styles.rowBetween}>
        {/* Área clicável para abrir detalhes */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={{ flex: 1, paddingRight: 12 }}
        >
          <Text style={styles.title}>{term?.cientifico || '—'}</Text>
          {!!(term?.populares?.length) && (
            <Text style={styles.subtitle}>{term.populares.join(', ')}</Text>
          )}
        </TouchableOpacity>

        {/* Favorito: não aciona navegação */}
        <TouchableOpacity
          onPress={onToggleFav}
          hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
          accessibilityRole="button"
          accessibilityLabel={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Ionicons
            name={isFav ? 'star' : 'star-outline'}
            size={22}
            color={isFav ? '#F59E0B' : '#9CA3AF'}
          />
        </TouchableOpacity>
      </View>

      {/* Chips (clicáveis para abrir detalhes) */}
      {(chips.length > 0 || term?.area || term?.categoria) && (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
          <View style={styles.chipsRow}>
            {(chips.length ? chips.slice(0, 2) : [term.area, term.categoria].filter(Boolean)).map(
              (c) => (
                <View key={c} style={styles.chip}>
                  <Text style={styles.chipText}>{c}</Text>
                </View>
              )
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* Rodapé: revisão + selo verificado */}
      <View style={styles.footerRow}>
        <Text style={styles.revisadoText}>
          Revisado em {term?.atualizadoEm || '--/--/----'}
        </Text>
        <View style={styles.verificadoWrap}>
          <Ionicons name="checkmark-circle" size={18} color="#059669" />
          <Text style={styles.verificadoText}>Verificado</Text>
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  subtitle: { color: '#6B7280', marginTop: 4 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  chipText: { color: '#4F46E5', fontWeight: '600' },
  footerRow: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  revisadoText: { color: '#6B7280', fontSize: 12 },
  verificadoWrap: { flexDirection: 'row', alignItems: 'center' },
  verificadoText: { color: '#059669', fontWeight: '600', marginLeft: 6 },
})
