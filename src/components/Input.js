import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Input({ icon, secure, value, onChangeText, placeholder, keyboardType, style }){
  const [hide, setHide] = React.useState(!!secure);
  return (
    <View style={[styles.wrap, style]}>
      {icon && <Ionicons name={icon} size={18} color='#666' style={{ marginRight:8 }} />}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor='#9AA3AF'
        secureTextEntry={hide}
        keyboardType={keyboardType}
        style={{ flex:1 }}
      />
      {secure && <Ionicons name={hide ? 'eye' : 'eye-off'} size={18} color='#666' onPress={()=>setHide(!hide)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:{ flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#E5E7EB', paddingHorizontal:12, height:44 }
});
