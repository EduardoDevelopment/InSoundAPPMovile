import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const Sidebar = ({ slideAnim, onClose }) => {
  const router = useRouter();

  const navigateToForm = () => {
    onClose();
    router.push("/screen/FormScreen");
  };
  const navigateToHome = () => {
    onClose();
    router.push("/screen/Home");
  };
  const navigateToDatabaseRecords = () => {
    onClose();
    router.push("/screen/DatabaseRecordsScreen");
  };

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.content}>
       
        <TouchableOpacity onPress={navigateToHome}>
        <Text style={styles.item}>🏠 Regresar a inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToForm}>
          <Text style={styles.item}>📝 Reservar Evento</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToDatabaseRecords}>
          <Text style={styles.item}>📊 Ver Registros</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.75,
    height: "100%",
    backgroundColor: "#222",
    zIndex: 10,
    paddingTop: 60,
  },
  closeIcon: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 11,
  },
  content: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    fontSize: 18,
    color: "white",
    marginVertical: 10,
  },
});

export default Sidebar;