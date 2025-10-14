import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import Button from '../../components/Button';
import { auth, db } from '../../firebase';
import { signOut, updateEmail, updatePassword, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Settings(){
  const user = auth.currentUser;
  const [nome, setNome] = React.useState(user?.displayName || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [senhaAtual, setSenhaAtual] = React.useState('');
  const [novaSenha, setNovaSenha] = React.useState('');
  const [confirma, setConfirma] = React.useState('');
  const [loading, setLoading] = React.useState(null);

  function notify(e){ Alert.alert('Info', e?.message || String(e)); }

  async function handleSalvarNome(){
    try{ setLoading('nome'); await updateProfile(auth.currentUser, { displayName: nome }); await setDoc(doc(db, 'profiles', user.uid), { nome }, { merge:true }); notify('Nome atualizado.'); }
    catch(e){ notify(e); } finally{ setLoading(null); }
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
    }catch(e){ notify(e); } finally{ setLoading(null); }
  }

  async function handleSalvarSenha(){
    try{
      setLoading('senha');
      if(novaSenha !== confirma) throw new Error('A confirmação de senha não confere.');
      const cred = EmailAuthProvider.credential(user.email, senhaAtual);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, novaSenha);
      setSenhaAtual(''); setNovaSenha(''); setConfirma('');
      notify('Senha atualizado.');
    }catch(e){ notify(e); } finally{ setLoading(null); }
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#F9FAFB', padding:16 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Seu Perfil</Text>
        <Text style={styles.label}>Nome</Text>
        <TextInput value={nome} onChangeText={setNome} style={styles.input} />
        <Text style={styles.label}>E-mail</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType='email-address' />
        <Text style={styles.label}>Senha atual (para alterar o e-mail)</Text>
        <TextInput value={senhaAtual} onChangeText={setSenhaAtual} style={styles.input} secureTextEntry />
        <View style={{ flexDirection:'row', gap:12, marginTop:12 }}>
          <Button title='Salvar nome' onPress={handleSalvarNome} loading={loading==='nome'} style={{ flex:1 }} />
          <Button title='Salvar e-mail' onPress={handleSalvarEmail} loading={loading==='email'} style={{ flex:1 }} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Segurança</Text>
        <Text style={styles.label}>Senha atual</Text>
        <TextInput value={senhaAtual} onChangeText={setSenhaAtual} style={styles.input} secureTextEntry />
        <Text style={styles.label}>Nova senha</Text>
        <TextInput value={novaSenha} onChangeText={setNovaSenha} style={styles.input} secureTextEntry />
        <Text style={styles.label}>Confirmar nova senha</Text>
        <TextInput value={confirma} onChangeText={setConfirma} style={styles.input} secureTextEntry />
        <Button title='Alterar senha' onPress={handleSalvarSenha} loading={loading==='senha'} style={{ marginTop:12 }} />
      </View>

      <Button title='Sair' onPress={()=>signOut(auth)} style={{ marginTop:12 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card:{ backgroundColor:'#fff', borderRadius:12, padding:16, marginBottom:12, elevation:1 },
  title:{ fontWeight:'800', marginBottom:8, fontSize:16 },
  label:{ color:'#6B7280', marginTop:8 },
  input:{ backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#E5E7EB', paddingHorizontal:12, height:44, marginTop:4 },
});
