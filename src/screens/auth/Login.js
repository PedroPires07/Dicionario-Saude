import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

export default function Login({ navigation }){
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  async function handleLogin(){
    try{ setLoading(true); setError(''); await signInWithEmailAndPassword(auth, email.trim(), password); }
    catch(e){ setError(e.message || String(e)); }
    finally{ setLoading(false); }
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#2D1C87' }} contentContainerStyle={{ flexGrow:1 }}>
      <View style={{ height:140 }} />
      <View style={styles.card}>
        <Text style={styles.title}>Entrar</Text>
        <Text style={styles.subtitle}>Lorem ipsum</Text>
        <Input icon='mail' placeholder='Email' value={email} onChangeText={setEmail} style={{ marginTop:16 }} keyboardType='email-address' />
        <Input icon='lock-closed' placeholder='Senha' value={password} onChangeText={setPassword} secure style={{ marginTop:12 }} />
        <TouchableOpacity onPress={()=>navigation.navigate('ForgotPassword')} style={{ marginTop:8 }}>
          <Text style={{ color:'#2563EB' }}>Esqueci minha senha</Text>
        </TouchableOpacity>
        <View style={{ flexDirection:'row', alignItems:'center', marginTop:12 }}>
          <TouchableOpacity onPress={()=>setRemember(!remember)} style={styles.checkbox}><View style={[styles.check, remember ? styles.checkOn : null]} /></TouchableOpacity>
          <Text>Remember me</Text>
        </View>
        {error ? <Text style={{ color:'#DC2626', marginTop:8 }}>{error}</Text> : null}
        <Button title='Entrar' onPress={handleLogin} loading={loading} style={{ marginTop:16 }} />
        <View style={{ alignItems:'center', marginTop:18 }}><Text>ou</Text></View>
        <View style={{ alignItems:'center', marginTop:18 }}><Text style={{ color:'#6B7280' }}>(Login social não configurado)</Text></View>
        <View style={{ alignItems:'center', marginTop:28 }}>
          <Text>Não tem conta? <Text style={{ color:'#1D4ED8' }} onPress={()=>navigation.navigate('Register')}>Cadastre-se</Text></Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card:{ flex:1, backgroundColor:'#F3F4F6', borderTopLeftRadius:24, borderTopRightRadius:24, padding:20 },
  title:{ fontSize:22, fontWeight:'800', color:'#1F2937' },
  subtitle:{ color:'#6B7280', marginTop:4 },
  checkbox:{ width:20, height:20, borderRadius:4, borderWidth:1, borderColor:'#9CA3AF', marginRight:8, alignItems:'center', justifyContent:'center' },
  check:{ width:12, height:12, borderRadius:2 },
  checkOn:{ backgroundColor:'#2D1C87' }
});
