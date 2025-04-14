import axios from 'axios';

const API_URL = 'http://192.168.100.2:3000/api/auth'; // Asegúrate de que esta URL sea correcta

// Función de registro
export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error('Error en la solicitud de registro:', error.response ? error.response.data : error.message); // Agregar log detallado
    throw error.response ? error.response.data : { message: 'Error en la solicitud de registro' }; // Lanza el error de la respuesta para manejarlo en el frontend
  }
};

// Función de inicio de sesión
export const login = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { identifier, password });
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error('Error en la solicitud de login:', error.response ? error.response.data : error.message); // Agregar log detallado
    throw error.response ? error.response.data : { message: 'Error en la solicitud de login' }; // Lanza el error de la respuesta para manejarlo en el frontend
  }
};
