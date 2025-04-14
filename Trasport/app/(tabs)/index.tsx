import { Redirect } from 'expo-router';

export default function Index() {
  // Redirige a la pantalla de Login
  return <Redirect href="/auth/LoginScreen" />;
}