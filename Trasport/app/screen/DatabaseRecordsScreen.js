import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Animated, Dimensions } from 'react-native';
import config from './config';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../components/Sidebar';

const { width } = Dimensions.get('window');

const DatabaseRecordsScreen = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-width * 0.75))[0];

  useEffect(() => {
    // Fetch the records from the database
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/api/event-reservations`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error fetching records: ${response.status} ${response.statusText}`, errorText);
          return;
        }
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedItem === item.id;
    return (
      <TouchableOpacity 
        onPress={() => setExpandedItem(isExpanded ? null : item.id)}
        style={[styles.item, isExpanded && styles.expandedItem]}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#5CE1E6" 
          />
        </View>
        
        {!isExpanded && (
          <View style={styles.previewInfo}>
            <Text style={styles.previewText}>
              <Ionicons name="calendar-outline" size={16} color="#5CE1E6" /> {formatDate(item.date)}
            </Text>
            <Text style={styles.previewText}>
              <Ionicons name="people-outline" size={16} color="#5CE1E6" /> {item.people} personas
            </Text>
          </View>
        )}

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color="#5CE1E6" />
              <Text style={styles.infoLabel}>Fecha:</Text>
              <Text style={styles.infoValue}>{formatDate(item.date)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="people" size={20} color="#5CE1E6" />
              <Text style={styles.infoLabel}>Personas:</Text>
              <Text style={styles.infoValue}>{item.people}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#5CE1E6" />
              <Text style={styles.infoLabel}>Ubicación:</Text>
              <Text style={styles.infoValue}>{item.location || 'No especificada'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={20} color="#5CE1E6" />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{item.email || 'No disponible'}</Text>
            </View>
            
            {item.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notas:</Text>
                <Text style={styles.notesText}>{item.notes}</Text>
              </View>
            )}
            
            <View style={styles.footer}>
              <Text style={styles.createdAt}>Creado: {formatDate(item.created_at)}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5CE1E6" />
        <Text style={styles.loadingText}>Cargando registros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoContainer}>
          <Text style={styles.logo}>IN SOUND</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Ionicons name="settings" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {sidebarVisible && <Sidebar slideAnim={slideAnim} onClose={toggleSidebar} />}

      {records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color="#5CE1E6" />
          <Text style={styles.noRecordsText}>No hay registros disponibles</Text>
          <Text style={styles.noRecordsSubtext}>Las reservaciones aparecerán aquí</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  sidebarButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  item: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#5CE1E6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expandedItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#5CE1E6',
    shadowColor: '#5CE1E6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  previewInfo: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 14,
    color: '#AAAAAA',
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5CE1E6',
    width: 80,
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
  },
  notesContainer: {
    marginTop: 8,
    backgroundColor: '#222222',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  notesLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5CE1E6',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 14,
    color: '#DDDDDD',
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12,
    marginTop: 8,
  },
  createdAt: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#121212',
  },
  noRecordsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  noRecordsSubtext: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 8,
  },
});

export default DatabaseRecordsScreen;