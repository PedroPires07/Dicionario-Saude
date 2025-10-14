import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './Card';
import { Ionicons } from '@expo/vector-icons';

export default function TermCard({ term, onToggleFav, isFav }){
  return (
    <Card style={{ marginBottom:12 }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
        <Text style={styles.title}>{term.cientifico}</Text>
        <TouchableOpacity onPress={onToggleFav}>
          <Ionicons name={isFav ? 'star' : 'star-outline'} size={20} color={isFav ? '#059669' : '#9CA3AF'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>{(term.populares || []).join(', ')}</Text>
      <View style={{ flexDirection:'row', marginTop:8 }}>
        <View style={[styles.badge, { backgroundColor: term.area === 'Medicina' ? '#D1FAE5' : '#DBEAFE' }]}>
          <Text style={[styles.badgeText, { color: term.area === 'Medicina' ? '#065F46' : '#1E40AF' }]}>{term.area}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor:'#F3F4F6', marginLeft:8 }]}>
          <Text style={[styles.badgeText, { color:'#374151' }]}>{term.categoria}</Text>
        </View>
      </View>
      <View style={{ marginTop:10, flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
        <Text style={{ color:'#6B7280', fontSize:12 }}>Revisado em {term.atualizadoEm || '--/--/----'}</Text>
        <View style={{ flexDirection:'row', alignItems:'center' }}>
          <Ionicons name='checkmark-circle' size={18} color='#059669' />
          <Text style={{ color:'#059669', fontWeight:'600', marginLeft:6 }}>Verificado</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title:{ fontSize:16, fontWeight:'700', color:'#111827' },
  subtitle:{ color:'#6B7280', marginTop:4 },
  badge:{ borderRadius:999, paddingHorizontal:10, paddingVertical:4 },
  badgeText:{ fontSize:12, fontWeight:'600' }
});
