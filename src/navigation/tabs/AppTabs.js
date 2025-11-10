import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../screens/app/Home';
import Terms from '../../screens/app/Terms';
import Favorites from '../../screens/app/Favorites';
import AI from '../../screens/app/AI';
import Settings from '../../screens/app/Settings';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export default function AppTabs(){
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#FFFFFF',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: { 
        backgroundColor: '#2D1C87',
        height: Platform.OS === 'ios' ? 85 : 70,
        paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        paddingTop: 10,
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      tabBarIcon: ({ color, size, focused }) => {
        const map = { Home:'home', Terms:'book', Favorites:'heart', AI:'chatbubble-ellipses', Settings:'settings' };
        const icon = map[route.name] || 'ellipse';
        return <Ionicons name={focused ? icon : `${icon}-outline`} size={24} color={color} />;
      }
    })}>
      <Tab.Screen name="Home" component={Home} options={{ title:'Início' }} />
      <Tab.Screen name="Terms" component={Terms} options={{ title:'Termos' }} />
      <Tab.Screen name="Favorites" component={Favorites} options={{ title:'Fav' }} />
      <Tab.Screen name="AI" component={AI} options={{ title:'IA' }} />
      <Tab.Screen name="Settings" component={Settings} options={{ title:'Ajustes' }} />
    </Tab.Navigator>
  );
}
