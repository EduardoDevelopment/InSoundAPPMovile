import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="auth/LoginScreen"
        options={{ title: 'Iniciar Sesión', headerShown: false }}
      />
      <Stack.Screen
        name="auth/RegisterScreen"
        options={{ title: 'Registro', headerShown: false }}
      />
      <Stack.Screen
        name="screen/HomeScreen"
        options={{ title: 'Inicio', headerShown: false }}
      />
      <Stack.Screen
        name="screen/FormScreen"
        options={{ title: 'Reservar Evento', headerShown: false }}
      />
      <Stack.Screen
        name="screen/DatabaseRecordsScreen"
        options={{ title: 'Ver Registros', headerShown: false }}
      />
      
    </Stack>
    
  );
}