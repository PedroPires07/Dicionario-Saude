import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function Button({ title, onPress, disabled, loading, style }){
  return (
    <TouchableOpacity
      style={[styles.btn, disabled ? styles.disabled : null, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.title}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor:'#2D1C87', borderRadius:24, height:48, alignItems:'center', justifyContent:'center' },
  title:{ color:'#fff', fontWeight:'700' },
  disabled:{ opacity:0.6 }
});
