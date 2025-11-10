import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

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
      <View style={styles.header}>
        <Image source={require('../../../assets/Exclude.png')} style={styles.headerLogo} resizeMode='contain' />
        <Text style={styles.headerText}>Dicionário de Saúde</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Entrar</Text>
        <Input icon='mail' placeholder='Email' value={email} onChangeText={setEmail} style={{ marginTop:16 }} keyboardType='email-address' />
        <Input icon='lock-closed' placeholder='Senha' value={password} onChangeText={setPassword} secure style={{ marginTop:12 }} />
        <TouchableOpacity onPress={()=>navigation.navigate('ForgotPassword')} style={{ marginTop:8 }}>
          <Text style={{ color:'#2563EB' }}>Esqueci minha senha</Text>
        </TouchableOpacity>
        <View style={{ flexDirection:'row', alignItems:'center', marginTop:12 }}>
          <TouchableOpacity onPress={()=>setRemember(!remember)} style={styles.checkbox}><View style={[styles.check, remember ? styles.checkOn : null]} /></TouchableOpacity>
          <Text>Lembre-se de mim</Text>
        </View>
        {error ? <Text style={{ color:'#DC2626', marginTop:8 }}>{error}</Text> : null}
        <Button title='Entrar' onPress={handleLogin} loading={loading} style={{ marginTop:16 }} />
        <View style={{ alignItems:'center', marginTop:28 }}>
          <Text>Não tem conta? <Text style={{ color:'#1D4ED8' }} onPress={()=>navigation.navigate('Register')}>Cadastre-se</Text></Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card:{ flex:1, backgroundColor:'#F3F4F6', borderTopLeftRadius:24, borderTopRightRadius:24, padding:20 },
  title:{ fontSize:22, fontWeight:'800', color:'#1F2937' },
  subtitle:{ color:'#6B7280', marginTop:4 },
  checkbox:{ width:20, height:20, borderRadius:4, borderWidth:1, borderColor:'#9CA3AF', marginRight:8, alignItems:'center', justifyContent:'center' },
  check:{ width:12, height:12, borderRadius:2 },
  checkOn:{ backgroundColor:'#2D1C87' }
});
