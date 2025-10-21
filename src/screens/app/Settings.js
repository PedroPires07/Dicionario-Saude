import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://dicionariodasaude.app/politica-de-privacidade');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://dicionariodasaude.app/termos-de-uso');
  };

  const openAboutApp = () => {
    Linking.openURL('https://dicionariodasaude.app/sobre');
  };

  const MenuItem = ({ icon, title, onPress, showChevron = true, rightElement }) => (
    <Pressable 
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        pressed && styles.menuItemPressed
      ]}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemLeft}>
          <Ionicons name={icon} size={22} color="#4B5563" style={styles.menuIcon} />
          <Text style={styles.menuText}>{title}</Text>
        </View>
        <View style={styles.menuItemRight}>
          {rightElement}
          {showChevron && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 16 }} // Adiciona padding no final da lista
      bounces={true} // Permite o efeito de bounce no iOS
      showsVerticalScrollIndicator={false} // Esconde a barra de rolagem
    >
      <View style={styles.section}>
        <MenuItem 
          icon="person-outline"
          title="Perfil"
          onPress={() => navigation.navigate('Profile')}
        />
        <MenuItem 
          icon="notifications-outline"
          title="Notificações"
          onPress={() => navigation.navigate('NotificationSettings')}
        />
      </View>

      <View style={styles.section}>
        <MenuItem 
          icon="shield-checkmark-outline"
          title="Privacidade e segurança"
          onPress={openPrivacyPolicy}
        />
        <MenuItem 
          icon="document-text-outline"
          title="Termos de uso"
          onPress={openTermsOfService}
        />
        <MenuItem 
          icon="information-circle-outline"
          title="Sobre o aplicativo"
          onPress={openAboutApp}
        />
      </View>

      <Pressable 
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed
        ]}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 20, // Adiciona espaço no topo
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16, // Adiciona margem nas laterais
    marginVertical: 8, // Ajusta espaçamento vertical entre seções
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2, // Adiciona sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: 60, // Garante altura mínima para toque
  },
  menuItemPressed: {
    backgroundColor: '#F3F4F6',
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1, // Garante que o conteúdo ocupe todo o espaço
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Permite que o texto ocupe o espaço disponível
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8, // Espaço entre o texto e o ícone
  },
  menuIcon: {
    marginRight: 12,
    width: 24, // Largura fixa para ícones
    textAlign: 'center', // Centraliza o ícone
  },
  menuText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1, // Permite que o texto quebre se necessário
  },
  logoutButton: {
    marginTop: 24,
    marginBottom: 32, // Adiciona margem inferior
    marginHorizontal: 16,
    backgroundColor: '#EF4444',
    paddingVertical: 16, // Aumenta área de toque
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logoutButtonPressed: {
    backgroundColor: '#DC2626',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
