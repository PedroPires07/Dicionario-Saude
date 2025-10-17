import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './auth/AuthStack';
import AppTabs from './tabs/AppTabs';
import Splash from '../screens/Splash';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';

const Stack = createNativeStackNavigator();

export default function RootNavigator(){
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{ setUser(u); setLoading(false); });
    return unsub;
  },[]);

  if(loading) return <Splash />;

  return (
    <Stack.Navigator screenOptions={{ headerShown:false }}>
      {user ? (
        <Stack.Screen name="AppTabs" component={AppTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
