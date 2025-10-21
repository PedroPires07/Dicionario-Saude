import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Platform } from 'react-native'
import AuthStack from './auth/AuthStack'
import AppTabs from './tabs/AppTabs'
import Splash from '../screens/Splash'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import TermDetails from '../screens/app/TermDetails'
import TermHeader from '../components/TermHeader'
import Profile from '../screens/app/Profile'
import NotificationSettings from '../screens/app/NotificationSettings'

const Stack = createNativeStackNavigator()

export default function RootNavigator() {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) return <Splash />

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AppTabs" component={AppTabs} />
        </Stack.Group>
      ) : (
       
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthStack} />
        </Stack.Group>
      )}

      
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true,
          title: 'Perfil',
          headerStyle: {
            backgroundColor: '#F9FAFB',
          },
          headerTintColor: '#4F46E5',
          headerBackTitle: Platform.OS === 'ios' ? 'Voltar' : undefined,
          animation: 'slide_from_right',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F9FAFB' },
        }}
      />

      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={{
          headerShown: true,
          title: 'Notificações',
          headerStyle: {
            backgroundColor: '#F9FAFB',
          },
          headerTintColor: '#4F46E5',
          headerBackTitle: Platform.OS === 'ios' ? 'Voltar' : undefined,
          animation: 'slide_from_right',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F9FAFB' },
        }}
      />

      <Stack.Screen
        name="TermDetails"
        component={TermDetails}
        options={({ route }) => ({
          headerShown: true,
          // Use o componente personalizado como título
          headerTitle: () => (
            <TermHeader term={route.params?.term} />
          ),
          headerStyle: { 
            backgroundColor: '#F9FAFB',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3
          },
          headerTintColor: '#4F46E5',
          // Personalização do botão voltar
          headerBackTitle: Platform.OS === 'ios' ? 'Voltar' : undefined,
          headerBackTitleStyle: {
            fontSize: 14,
            color: '#4F46E5',
          },
          // Ícone de voltar roxo
          headerTintColor: '#4F46E5',
          // Animações e comportamento
          animation: 'slide_from_right',
          headerMode: 'float',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F9FAFB' },
          // Altura do header para acomodar duas linhas
          headerStyle: {
            backgroundColor: '#F9FAFB',
            height: Platform.OS === 'ios' ? 100 : 80,
          },
        })}
      />
    </Stack.Navigator>
  )
}
