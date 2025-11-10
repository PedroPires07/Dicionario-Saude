import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Register({ navigation }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  function strongEnough(pw) { return /^(?=.*\d).{8,}$/.test(pw); }

  async function handleRegister() {
    try {
      setLoading(true); setError('');
      if (password !== confirm) throw new Error('As senhas não conferem.');
      if (!strongEnough(password)) throw new Error('A senha deve ter no mínimo 8 caracteres e 1 número.');
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(res.user, { displayName: name });
      await setDoc(doc(db, 'profiles', res.user.uid), {
        id: res.user.uid,
        nome: name,
        email: email.trim(),
        role: 'viewer',        
        origem: 'app',         
        ativo: true,
        ultimoAcesso: new Date().toISOString(),
      }, { merge: true });

    } catch (e) { setError(e.message || String(e)); }
    finally { setLoading(false); }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#2D1C87' }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.header}>
        <Image source={require('../../../assets/Exclude.png')} style={styles.headerLogo} resizeMode='contain' />
        <Text style={styles.headerText}>Dicionário de Saúde</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastrar</Text>
        <Input icon='person' placeholder='Nome' value={name} onChangeText={setName} style={{ marginTop: 16 }} />
        <Input icon='mail' placeholder='Email' value={email} onChangeText={setEmail} keyboardType='email-address' style={{ marginTop: 12 }} />
        <Input icon='lock-closed' placeholder='Senha' value={password} onChangeText={setPassword} secure style={{ marginTop: 12 }} />
        <Input icon='lock-closed' placeholder='Confirmar senha' value={confirm} onChangeText={setConfirm} secure style={{ marginTop: 12 }} />
        <Text style={{ color: '#DC2626', marginTop: 6 }}>* Sua senha precisa ter no mínimo 8 caracteres e 1 número.</Text>
        {error ? <Text style={{ color: '#DC2626', marginTop: 6 }}>{error}</Text> : null}
        <Button title='Entrar' onPress={handleRegister} loading={loading} style={{ marginTop: 16 }} />
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Text>Ao entrar, você concorda com nossos <Text style={{ color: '#1D4ED8' }}>termos de uso</Text> e <Text style={{ color: '#1D4ED8' }}>política de privacidade</Text>.</Text>
        </View>
        <View style={{ alignItems: 'center', marginTop: 22 }}>
          <Text>Já tem conta? <Text style={{ color: '#1D4ED8' }} onPress={() => navigation.navigate('Login')}>Entrar</Text></Text>
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
  card: { flex: 1, backgroundColor: '#F3F4F6', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#1F2937' },
  subtitle: { color: '#6B7280', marginTop: 4 },
});
