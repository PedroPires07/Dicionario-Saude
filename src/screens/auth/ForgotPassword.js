import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth} from '../../services/firebase';

export default function ForgotPassword({ navigation }){
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState('');

  async function handleSend(){
    try{ setLoading(true); setMsg(''); await sendPasswordResetEmail(auth, email.trim()); setMsg('Enviamos um e-mail com instruções para redefinir sua senha.'); }
    catch(e){ setMsg(e.message || String(e)); }
    finally{ setLoading(false); }
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#2D1C87' }} contentContainerStyle={{ flexGrow:1 }}>
      <View style={styles.header}>
        <Image source={require('../../../assets/Exclude.png')} style={styles.headerLogo} resizeMode='contain' />
        <Text style={styles.headerText}>Dicionário de Saúde</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Redefinir Senha</Text>
        <Text style={styles.subtitle}>Digite seu E-mail</Text>
        <Input icon='mail' placeholder='Email' value={email} onChangeText={setEmail} keyboardType='email-address' style={{ marginTop:16 }} />
        {msg ? <Text style={{ color:'#111827', marginTop:8 }}>{msg}</Text> : null}
        <Button title='Entrar' onPress={handleSend} loading={loading} style={{ marginTop:16 }} />
        <View style={{ alignItems:'center', marginTop:20 }}>
          <Text style={{ color:'#DC2626' }} onPress={()=>navigation.goBack()}>Voltar</Text>
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
});
