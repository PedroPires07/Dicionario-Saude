import React from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Button from '../../components/Button';
import { auth, db } from '../../services/firebase';
import { updateEmail, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const user = auth.currentUser;
  const [nome, setNome] = React.useState(user?.displayName || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [senhaAtual, setSenhaAtual] = React.useState('');
  const [loading, setLoading] = React.useState(null);

  function notify(e){ Alert.alert('Info', e?.message || String(e)); }

  async function handleSalvarNome(){
    try{ 
      setLoading('nome');
      await updateProfile(auth.currentUser, { displayName: nome });
      await setDoc(doc(db, 'profiles', user.uid), { nome }, { merge:true });
      notify('Nome atualizado.');
    }
    catch(e){ notify(e); }
    finally{ setLoading(null); }
  }

  async function handleSalvarEmail(){
    try{
      setLoading('email');
      if(!senhaAtual) throw new Error('Informe a senha atual para alterar o e-mail.');
      const cred = EmailAuthProvider.credential(user.email, senhaAtual);
      await reauthenticateWithCredential(user, cred);
      await updateEmail(user, email.trim());
      await setDoc(doc(db, 'profiles', user.uid), { email: email.trim() }, { merge:true });
      notify('E-mail atualizado.');
      setSenhaAtual('');
    }catch(e){ notify(e); }
    finally{ setLoading(null); }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput 
          value={nome} 
          onChangeText={setNome} 
          style={styles.input}
          placeholder="Seu nome"
        />
        <Button 
          title='Salvar nome' 
          onPress={handleSalvarNome} 
          loading={loading==='nome'} 
          style={styles.button} 
        />

        <Text style={[styles.label, styles.spacingTop]}>E-mail</Text>
        <TextInput 
          value={email} 
          onChangeText={setEmail} 
          style={styles.input}
          keyboardType='email-address'
          placeholder="Seu e-mail"
        />
        <Text style={styles.label}>Senha atual</Text>
        <TextInput 
          value={senhaAtual} 
          onChangeText={setSenhaAtual} 
          style={styles.input} 
          secureTextEntry
          placeholder="Necessária para alterar o e-mail"
        />
        <Button 
          title='Salvar e-mail' 
          onPress={handleSalvarEmail} 
          loading={loading==='email'} 
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  spacingTop: {
    marginTop: 24,
  },
});