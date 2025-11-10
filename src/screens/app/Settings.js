import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Image, Switch, Alert, TextInput, Modal } from 'react-native';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const navigation = useNavigation();
  const [notificationEnabled, setNotificationEnabled] = React.useState(true);
  const [privacyExpanded, setPrivacyExpanded] = React.useState(false);
  const [aboutExpanded, setAboutExpanded] = React.useState(false);
  const [showNameEdit, setShowNameEdit] = React.useState(false);
  const [newName, setNewName] = React.useState('');

  const user = auth.currentUser;

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

  const handleClearHistory = async () => {
    Alert.alert(
      'Limpar histórico',
      'Tem certeza que deseja limpar todo o histórico de busca e navegação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('searchHistory');
              await AsyncStorage.removeItem('navigationHistory');
              Alert.alert('Sucesso', 'Histórico limpo com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível limpar o histórico.');
              console.error('Erro ao limpar histórico:', error);
            }
          },
        },
      ]
    );
  };

  const handleChangeName = async () => {
    if (!newName.trim()) {
      Alert.alert('Erro', 'Por favor, digite um nome válido.');
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: newName.trim(),
      });
      setShowNameEdit(false);
      setNewName('');
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o nome.');
      console.error('Erro ao atualizar nome:', error);
    }
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
    <View style={styles.container}>
      {/* Header sem foto */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Text style={styles.userName}>{user?.displayName || 'Usuário'}</Text>
          <Pressable onPress={() => {
            setNewName(user?.displayName || '');
            setShowNameEdit(true);
          }}>
            <Text style={styles.editNameText}>Alterar nome de usuário</Text>
          </Pressable>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Notificação */}
        <View style={styles.section}>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={20} color="#6B7280" style={styles.menuIcon} />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Notificação</Text>
                <Text style={styles.menuSubtext}>Ativar Notificação</Text>
              </View>
            </View>
            <Switch
              value={notificationEnabled}
              onValueChange={setNotificationEnabled}
              trackColor={{ false: '#D1D5DB', true: '#2D1C87' }}
              thumbColor="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Limpar histórico */}
        <View style={styles.section}>
          <Pressable style={styles.menuItem} onPress={handleClearHistory}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="time-outline" size={20} color="#6B7280" style={styles.menuIcon} />
              <Text style={styles.menuText}>Limpar histórico</Text>
            </View>
          </Pressable>
        </View>

        {/* Privacidade e segurança */}
        <View style={styles.section}>
          <Pressable 
            style={styles.menuItem}
            onPress={() => setPrivacyExpanded(!privacyExpanded)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.menuIcon} />
              <Text style={styles.menuText}>Privacidade e segurança</Text>
            </View>
            <Ionicons 
              name={privacyExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#9CA3AF" 
            />
          </Pressable>
          {privacyExpanded && (
            <View style={styles.submenu}>
              <Pressable style={styles.submenuItem} onPress={openPrivacyPolicy}>
                <Text style={styles.submenuText}>Gerenciar permissões</Text>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </Pressable>
              <Pressable style={styles.submenuItem} onPress={openPrivacyPolicy}>
                <Text style={styles.submenuText}>Política de privacidade</Text>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </Pressable>
              <Pressable style={styles.submenuItem} onPress={openTermsOfService}>
                <Text style={styles.submenuText}>Termos de uso</Text>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </Pressable>
            </View>
          )}
        </View>

        {/* Sobre o aplicativo */}
        <View style={styles.section}>
          <Pressable 
            style={styles.menuItem}
            onPress={() => setAboutExpanded(!aboutExpanded)}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="information-circle-outline" size={20} color="#6B7280" style={styles.menuIcon} />
              <Text style={styles.menuText}>Sobre o aplicativo</Text>
            </View>
            <Ionicons 
              name={aboutExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#9CA3AF" 
            />
          </Pressable>
          {aboutExpanded && (
            <View style={styles.submenu}>
              <View style={styles.submenuItem}>
                <Text style={styles.submenuText}>Última atualização</Text>
                <Text style={styles.submenuValue}>15/01/2025</Text>
              </View>
              <Pressable style={styles.submenuItem} onPress={openAboutApp}>
                <Text style={styles.submenuText}>Suporte</Text>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </Pressable>
              <Pressable style={styles.submenuItem} onPress={openAboutApp}>
                <Text style={styles.submenuText}>Avaliar aplicativo</Text>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </Pressable>
            </View>
          )}
        </View>

        {/* Botão Sair */}
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

      {/* Modal para editar nome */}
      <Modal
        visible={showNameEdit}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowNameEdit(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar nome de usuário</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Digite seu novo nome"
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowNameEdit(false);
                  setNewName('');
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleChangeName}
              >
                <Text style={styles.modalButtonTextSave}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D1C87',
  },
  header: {
    backgroundColor: '#2D1C87',
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  editNameText: {
    fontSize: 14,
    color: '#E0E0E0',
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
    width: 24,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  menuSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  submenu: {
    backgroundColor: '#F9FAFB',
    paddingTop: 8,
  },
  submenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingLeft: 52,
  },
  submenuText: {
    fontSize: 14,
    color: '#6B7280',
  },
  submenuValue: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  logoutButtonPressed: {
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalButtonSave: {
    backgroundColor: '#2D1C87',
  },
  modalButtonTextCancel: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSave: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
