import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import config from './config';
import Sidebar from '../components/Sidebar';

const { width, height } = Dimensions.get('window');

const FormScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [people, setPeople] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-width * 0.75))[0];
  const fadeIn = useRef(new Animated.Value(0)).current;
  
  // Simplificamos las animaciones eliminando la rotación
  React.useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleSidebar = () => {
    if (sidebarVisible) {
      Animated.timing(slideAnim, {
        toValue: -width * 0.75,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    // Validación de campos obligatorios
    if (!email || !name || !people) {
      Alert.alert("Campos requeridos", "Por favor completa los campos obligatorios.");
      return;
    }

    // Validación del correo electrónico
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Correo inválido", "Ingresa un correo electrónico válido.");
      return;
    }

    // Validación del número de personas
    const peopleNumber = parseInt(people, 10);
    if (isNaN(peopleNumber) || peopleNumber < 1) {
      Alert.alert("Número inválido", "El número de personas debe ser al menos 1.");
      return;
    }

    const reservationData = {
      email,
      name,
      date: date.toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
      people: peopleNumber,
      location,
      notes,
    };

    try {
      setIsSubmitting(true); // Deshabilitar el botón mientras se envía la solicitud
      const response = await fetch(`${config.BASE_URL}/api/event-reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        Alert.alert("Reserva realizada", "Tu evento ha sido reservado con éxito.");
        console.log('Reservation data:', reservationData);

        // Limpiar formulario después de una reserva exitosa
        setEmail('');
        setName('');
        setDate(new Date());
        setPeople('');
        setLocation('');
        setNotes('');
      } else {
        const errorText = await response.text(); // Obtener detalles del error como texto
        Alert.alert("Error", `Hubo un problema al realizar la reserva: ${errorText}`);
        console.error('Error details:', errorText);
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al conectar con el servidor. Por favor, inténtalo de nuevo.");
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false); // Habilitar el botón nuevamente
    }
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <View style={styles.container}>
      <Sidebar slideAnim={slideAnim} onClose={toggleSidebar} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoContainer}>
          <Text style={styles.logo}>IN SOUND</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Ionicons name="settings" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.formContainer}
        >
          <ImageBackground
            source={{ uri: "https://via.placeholder.com/400x200" }}
            style={styles.formHeader}
            resizeMode="cover"
          >
            <View style={styles.formHeaderOverlay}>
              <Animated.Text style={[styles.formTitle, { opacity: fadeIn }]}>
                Reserva tu Evento
              </Animated.Text>
              <Animated.Text style={[styles.formSubtitle, { opacity: fadeIn }]}>
                Completa el formulario y nos pondremos en contacto contigo
              </Animated.Text>
            </View>
          </ImageBackground>

          <View style={styles.formContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#5CE1E6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Ingresa tu correo electrónico"
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#5CE1E6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ingresa tu nombre completo"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha del evento</Text>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)} 
                style={styles.datePickerButton}
              >
                <Ionicons name="calendar" size={20} color="#5CE1E6" style={styles.inputIcon} />
                <Text style={styles.dateText}>
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  themeVariant="dark"
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número de personas</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="people" size={20} color="#5CE1E6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={people}
                  onChangeText={setPeople}
                  placeholder="Ingresa el número de asistentes"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ubicación</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location" size={20} color="#5CE1E6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Lugar donde se realizará el evento"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notas adicionales</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={styles.textArea}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Información adicional sobre tu evento, requerimientos especiales, etc."
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Text style={styles.submitButtonText}>Reservar Ahora</Text>
              )}
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="shield-checkmark" size={20} color="#5CE1E6" />
                <Text style={styles.infoText}>Datos protegidos</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time" size={20} color="#5CE1E6" />
                <Text style={styles.infoText}>Respuesta en 24h</Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    zIndex: 1,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5CE1E6",
    letterSpacing: 1,
  },
  menuButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
  formHeader: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  formHeaderOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  formSubtitle: {
    fontSize: 16,
    color: "#5CE1E6",
    textAlign: "center",
    marginBottom: 5,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  formContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    height: 50,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 15,
    height: 50,
  },
  dateText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  textAreaContainer: {
    height: 120,
    alignItems: "flex-start",
  },
  textArea: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingTop: 15,
    paddingBottom: 15,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#5CE1E6",
    borderRadius: 25,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#5CE1E6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#2D7073",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#121212",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    color: "#AAAAAA",
    marginLeft: 5,
    fontSize: 14,
  }
};

export default FormScreen;