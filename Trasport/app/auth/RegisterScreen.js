import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, Alert, Modal,
  TouchableOpacity, Animated, Easing, ScrollView, Image
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { register } from './_api'; // Ajusta el path si es necesario

const RegisterScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const titleAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
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
        Animated.timing(neonBorder, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(neonBorder, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleRegister = async () => {
    if (!termsAccepted) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    try {
      const { userId, token } = await register(name.trim(), email.trim(), password);
      await AsyncStorage.setItem('userId', userId.toString());
      await AsyncStorage.setItem('token', token);
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      router.push('../screen/Home');
    } catch (error) {
      Alert.alert('Error', error.message || 'Algo salió mal');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Animated.View style={{ transform: [{ scale: logoScale }], marginBottom: 20 }}>
        <Image source={require('../../assets/logo.jpg')} style={{ width: 120, height: 120, borderRadius: 20 }} />
      </Animated.View>

      <Animated.Text style={{
        fontSize: 26,
        color: 'white',
        fontWeight: 'bold',
        opacity: titleAnim,
        transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        marginBottom: 20
      }}>
        Registro
      </Animated.Text>

      {[{ placeholder: "Nombre", value: name, onChangeText: setName },
        { placeholder: "Email", value: email, onChangeText: setEmail, keyboardType: "email-address", autoCapitalize: "none" },
        { placeholder: "Contraseña", value: password, onChangeText: setPassword, secureTextEntry: true },
        { placeholder: "Confirmar Contraseña", value: confirmPassword, onChangeText: setConfirmPassword, secureTextEntry: true },
      ].map((input, index) => (
        <Animated.View key={index} style={{
          borderWidth: 2,
          borderColor: neonBorder.interpolate({
            inputRange: [0, 1],
            outputRange: ['cyan', 'magenta']
          }),
          padding: 10,
          width: '100%',
          borderRadius: 10,
          marginBottom: 12,
        }}>
          <TextInput
            {...input}
            placeholderTextColor="gray"
            style={{ color: 'white', fontSize: 16 }}
          />
        </Animated.View>
      ))}

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
        <Checkbox
          status={termsAccepted ? 'checked' : 'unchecked'}
          onPress={() => setTermsAccepted(!termsAccepted)}
          color="cyan"
        />
        <Text onPress={() => setModalVisible(true)} style={{ color: 'cyan', textDecorationLine: 'underline' }}>
          Ver Términos y Condiciones
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        disabled={!termsAccepted}
        style={{
          backgroundColor: termsAccepted ? 'cyan' : 'gray',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: termsAccepted ? 1 : 0.6,
          shadowColor: 'cyan',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.7,
          shadowRadius: 10,
        }}
      >
        <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Registrarse</Text>
      </TouchableOpacity>

      {/* Enlace a Login */}
      <TouchableOpacity onPress={() => router.push('./LoginScreen')}>
        <Text style={{ color: 'white', marginTop: 20, textDecorationLine: 'underline' }}>
          ¿Ya tienes una cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>

      {/* Modal de términos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}>
          <ScrollView style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 20,
            width: '85%',
            maxHeight: '80%',
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
              Términos y Condiciones
            </Text>
            <Text style={{ fontSize: 14, textAlign: 'justify' }}>
              1. Esta aplicación está diseñada para gestionar inventarios de manera eficiente. {'\n\n'}
              2. Los datos ingresados por el usuario serán almacenados de manera segura, pero es responsabilidad del usuario mantener sus credenciales seguras. {'\n\n'}
              3. No nos hacemos responsables por la pérdida de información debido a errores del usuario o problemas técnicos. {'\n\n'}
              4. El uso de esta aplicación implica la aceptación de estos términos y condiciones. {'\n\n'}
              5. Nos reservamos el derecho de modificar estos términos en cualquier momento sin previo aviso.
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: '#2196F3',
                borderRadius: 20,
                padding: 10,
                marginTop: 20,
                alignSelf: 'center',
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default RegisterScreen;
