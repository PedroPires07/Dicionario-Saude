import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResetSuccess({ navigation }){
  return (
    <View style={styles.container}>
      <Ionicons name='checkmark-circle-outline' size={120} color='#E5E7EB' />
      <Text style={styles.text}>Senha redefinida com sucesso.</Text>
      <TouchableOpacity onPress={()=>navigation.replace('Login')}>
        <Text style={[styles.text, { textDecorationLine:'underline' }]}>Faça login novamente.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#2D1C87', alignItems:'center', justifyContent:'center' },
  text:{ color:'#E5E7EB', marginTop:16, fontSize:16 }
});
