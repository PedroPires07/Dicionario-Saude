import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TermHeader({ term }) {
  const cientifico = term?.cientifico || 'Detalhes';
  const populares = term?.populares || [];
  
  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.title}>
        {cientifico}
      </Text>
      {populares.length > 0 && (
        <Text numberOfLines={1} style={styles.subtitle}>
          {populares.join(', ')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 1,
    textAlign: 'center',
  },
});