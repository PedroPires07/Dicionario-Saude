import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationSettings() {
  const [allNotifications, setAllNotifications] = React.useState(false);
  const [newTerms, setNewTerms] = React.useState(false);
  const [updates, setUpdates] = React.useState(false);

  React.useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setAllNotifications(parsed.all);
        setNewTerms(parsed.newTerms);
        setUpdates(parsed.updates);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const saveNotificationSettings = async (key, value) => {
    try {
      const settings = {
        all: key === 'all' ? value : allNotifications,
        newTerms: key === 'newTerms' ? value : newTerms,
        updates: key === 'updates' ? value : updates,
      };
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  const handleToggleAll = (value) => {
    setAllNotifications(value);
    setNewTerms(value);
    setUpdates(value);
    saveNotificationSettings('all', value);
  };

  const handleToggleNewTerms = (value) => {
    setNewTerms(value);
    saveNotificationSettings('newTerms', value);
  };

  const handleToggleUpdates = (value) => {
    setUpdates(value);
    saveNotificationSettings('updates', value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.setting}>
          <View>
            <Text style={styles.settingTitle}>Ativar notificações</Text>
            <Text style={styles.settingDescription}>
              Ativar ou desativar todas as notificações
            </Text>
          </View>
          <Switch
            value={allNotifications}
            onValueChange={handleToggleAll}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.setting}>
          <View>
            <Text style={styles.settingTitle}>Novos termos</Text>
            <Text style={styles.settingDescription}>
              Receber notificações quando novos termos forem adicionados
            </Text>
          </View>
          <Switch
            value={newTerms}
            onValueChange={handleToggleNewTerms}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
            thumbColor="#FFFFFF"
            disabled={!allNotifications}
          />
        </View>

        <View style={styles.setting}>
          <View>
            <Text style={styles.settingTitle}>Atualizações</Text>
            <Text style={styles.settingDescription}>
              Receber notificações sobre atualizações do aplicativo
            </Text>
          </View>
          <Switch
            value={updates}
            onValueChange={handleToggleUpdates}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
            thumbColor="#FFFFFF"
            disabled={!allNotifications}
          />
        </View>
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
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingTitle: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    maxWidth: '80%',
  },
});