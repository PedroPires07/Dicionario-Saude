import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Splash(){
  return (
    <View style={styles.container}>
      <Ionicons name="medkit" size={72} color="#fff" />
      <ActivityIndicator color="#fff" size="large" style={{ marginTop: 16 }} />
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#2D1C87', alignItems:'center', justifyContent:'center' }
});
