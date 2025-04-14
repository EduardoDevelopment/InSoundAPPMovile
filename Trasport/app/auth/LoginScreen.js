import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Animated, Easing, Image, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from './_api';

const LoginScreen = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Animaciones
  const titleAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const neonBorder = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    Animated.spring(logoScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(neonBorder, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(neonBorder, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await login(identifier.trim(), password);
      const { userId, token } = response;
      if (userId && token) {
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('token', token);
        Alert.alert('Éxito', 'Inicio de sesión exitoso');
        router.push('../screen/Home');
      } else {
        Alert.alert('Error', 'No se pudo obtener el ID de usuario o el token');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Algo salió mal');
    }
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.9, speed: 20, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, speed: 10, bounciness: 10, useNativeDriver: true }).start();
  };

  const interpolatedNeon = neonBorder.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 255, 255, 0.3)', 'rgba(0, 255, 255, 1)'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: logoScale }] }}>
        <Image source={require('../../assets/logo.jpg')} style={styles.logo} />
      </Animated.View>


      <Animated.Text
        style={[
          styles.title,
          {
            opacity: titleAnim,
            transform: [
              {
                translateY: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        Inicio de Sesión
      </Animated.Text>

      <Animated.View style={[styles.inputContainer, { borderColor: interpolatedNeon }]}>
        <TextInput
          placeholder="Correo o Usuario"
          value={identifier}
          onChangeText={(text) => setIdentifier(text)}
          placeholderTextColor="gray"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </Animated.View>

      <Animated.View style={[styles.inputContainer, { borderColor: interpolatedNeon }]}>
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="gray"
          style={styles.input}
        />
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          onPress={handleLogin}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={!identifier || !password}
          style={[
            styles.loginButton,
            { opacity: identifier && password ? 1 : 0.5 },
          ]}
        >
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={() => router.push('/auth/RegisterScreen')}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 2,
    padding: 10,
    width: '80%',
    borderRadius: 8,
    marginVertical: 10,
  },
  input: {
    color: 'white',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: 'cyan',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    ...(Platform.OS === 'android'
      ? { elevation: 10 }
      : {
        shadowColor: 'cyan',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      }),
  },
  loginButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: 'white',
    marginTop: 15,
  },
});

export default LoginScreen;
