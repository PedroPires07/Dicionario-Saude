import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import * as Linking from 'expo-linking';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../services/firebase';

export default function ResetPassword({ navigation, route }){
  const [code, setCode] = React.useState(route?.params?.oobCode || '');
  const [pw, setPw] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');

  React.useEffect(()=>{
    const sub = Linking.addEventListener('url', ({ url }) => {
      const parsed = Linking.parse(url);
      const oob = parsed?.queryParams?.oobCode;
      if(oob) setCode(oob);
    });
    return ()=> sub.remove();
  },[]);

  async function handleConfirm(){
    try{
      if(pw !== confirm) throw new Error('As senhas não conferem.');
      setLoading(true); setErr('');
      if(!code) throw new Error('Código de redefinição não encontrado.');
      await confirmPasswordReset(auth, code, pw);
      navigation.replace('ResetSuccess');
    }catch(e){ setErr(e.message || String(e)); }
    finally{ setLoading(false); }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow:1 }} style={{ flex:1, backgroundColor:'#2D1C87' }}>
      <View style={{ height:120 }} />
      <View style={styles.card}>
        <Text style={styles.title}>Redefinir Senha</Text>
        <Text style={styles.subtitle}>Lorem ipsum</Text>
        {!code ? (<Input icon='key' placeholder='Código (oobCode)' value={code} onChangeText={setCode} style={{ marginTop:16 }} />) : null}
        <Input icon='lock-closed' placeholder='Senha' value={pw} onChangeText={setPw} secure style={{ marginTop:16 }} />
        <Input icon='lock-closed' placeholder='Confirmar Senha' value={confirm} onChangeText={setConfirm} secure style={{ marginTop:12 }} />
        {err ? <Text style={{ color:'#DC2626', marginTop:8 }}>{err}</Text> : null}
        <Button title='Confirmar' onPress={handleConfirm} loading={loading} style={{ marginTop:16 }} />
        <View style={{ alignItems:'center', marginTop:20 }}>
          <Text style={{ color:'#DC2626' }} onPress={()=>navigation.navigate('Login')}>Sair</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card:{ flex:1, backgroundColor:'#F3F4F6', borderTopLeftRadius:24, borderTopRightRadius:24, padding:20 },
  title:{ fontSize:22, fontWeight:'800', color:'#1F2937' },
  subtitle:{ color:'#6B7280', marginTop:4 },
});
