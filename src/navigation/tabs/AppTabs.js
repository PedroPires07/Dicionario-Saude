import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../screens/app/Home';
import Terms from '../../screens/app/Terms';
import Favorites from '../../screens/app/Favorites';
import AI from '../../screens/app/AI';
import Settings from '../../screens/app/Settings';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function AppTabs(){
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#2D1C87',
      tabBarStyle: { height: 64, paddingBottom: 10, paddingTop: 6 },
      tabBarIcon: ({ color, size }) => {
        const map = { Home:'home', Terms:'book', Favorites:'star', AI:'sparkles', Settings:'settings' };
        const icon = map[route.name] || 'ellipse';
        return <Ionicons name={icon} size={size} color={color} />;
      }
    })}>
      <Tab.Screen name="Home" component={Home} options={{ title:'Início' }} />
      <Tab.Screen name="Terms" component={Terms} options={{ title:'Termos' }} />
      <Tab.Screen name="Favorites" component={Favorites} options={{ title:'Fav' }} />
      <Tab.Screen name="AI" component={AI} />
      <Tab.Screen name="Settings" component={Settings} options={{ title:'Ajustes' }} />
    </Tab.Navigator>
  );
}
