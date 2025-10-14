import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../screens/auth/Login';
import Register from '../../screens/auth/Register';
import ForgotPassword from '../../screens/auth/ForgotPassword';
import ResetPassword from '../../screens/auth/ResetPassword';
import ResetSuccess from '../../screens/auth/ResetSuccess';

const Stack = createNativeStackNavigator();

export default function AuthStack(){
  return (
    <Stack.Navigator screenOptions={{ headerShown:false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ResetSuccess" component={ResetSuccess} />
    </Stack.Navigator>
  );
}
