import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import Sidebar from "../components/Sidebar";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideText = useRef(new Animated.Value(-width)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const slideSidebar = useRef(new Animated.Value(-width)).current;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");

  // Datos para las secciones de eventos
  const upcomingEvents = [
    {
      id: 1,
      title: "Festival Electrónico",
      date: "28 Abril 2025",
      location: "Arena Ciudad de México",
      image: "https://via.placeholder.com/150",
      description: "El evento electrónico más grande del año con DJs internacionales.",
    },
    {
      id: 2,
      title: "Concierto Rock Alternativo",
      date: "15 Mayo 2025",
      location: "Foro Sol",
      image: "https://via.placeholder.com/150",
      description: "Una noche llena de rock con bandas nacionales e internacionales.",
    },
    {
      id: 3,
      title: "Jazz en la Plaza",
      date: "5 Junio 2025",
      location: "Parque Lincoln",
      image: "https://via.placeholder.com/150",
      description: "Un evento cultural con los mejores exponentes del jazz contemporáneo.",
    },
  ];

  const services = [
    {
      id: 1,
      title: "Sonido Profesional",
      icon: "microphone-alt",
      description: "Equipos de última generación para eventos de cualquier tamaño. Incluye monitores, mezcladores digitales y sistemas line array.",
    },
    {
      id: 2,
      title: "Iluminación LED",
      icon: "lightbulb",
      description: "Sistemas de iluminación inteligente, controlados por DMX con efectos sincronizados y programación personalizada.",
    },
    {
      id: 3,
      title: "DJs Profesionales",
      icon: "headphones",
      description: "Staff de DJs con experiencia internacional en diversos géneros musicales para adaptarse a cualquier tipo de evento.",
    },
    {
      id: 4,
      title: "Producción Audiovisual",
      icon: "film",
      description: "Pantallas LED, proyectores y contenido multimedia personalizado para complementar tu evento.",
    },
    {
      id: 5,
      title: "Estructura y Escenarios",
      icon: "stage",
      description: "Montaje de escenarios profesionales con estructuras certificadas para eventos seguros y espectaculares.",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Carlos Ramírez",
      event: "Boda en Hacienda Los Olivos",
      comment: "El servicio de IN SOUND superó nuestras expectativas. El sonido fue perfecto y la iluminación transformó completamente el espacio.",
      rating: 5,
    },
    {
      id: 2,
      name: "Grupo Empresarial Nexus",
      event: "Lanzamiento de Producto",
      comment: "Profesionalismo total. Se encargaron de todos los detalles técnicos permitiéndonos concentrarnos en nuestro evento.",
      rating: 5,
    },
    {
      id: 3,
      name: "Festival Urbano CDMX",
      event: "Festival Anual",
      comment: "Tercer año consecutivo trabajando con IN SOUND. La calidad de audio es inigualable y el staff siempre resuelve cualquier imprevisto.",
      rating: 4.9,
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(slideText, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, []);

  const toggleSidebar = () => {
    Animated.timing(slideSidebar, {
      toValue: sidebarVisible ? -width : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!sidebarVisible);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderSection = () => {
    switch (activeSection) {
      case "eventos":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
            {upcomingEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
                <View style={styles.eventContent}>
                  <Image 
                    source={{ uri: event.image }} 
                    style={styles.eventImage} 
                    resizeMode="cover"
                  />
                  <View style={styles.eventDetails}>
                    <View style={styles.locationContainer}>
                      <Ionicons name="location" size={16} color="#5CE1E6" />
                      <Text style={styles.eventLocation}>{event.location}</Text>
                    </View>
                    <Text style={styles.eventDescription}>{event.description}</Text>
                    <TouchableOpacity style={styles.eventButton}>
                      <Text style={styles.eventButtonText}>Más Información</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      
      case "servicios":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Nuestros Servicios</Text>
            {services.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceIconContainer}>
                  <FontAwesome5 name={service.icon} size={24} color="#5CE1E6" />
                </View>
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                </View>
              </View>
            ))}
          </View>
        );
      
      case "testimonios":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Testimonios</Text>
            {testimonials.map((testimonial) => (
              <View key={testimonial.id} style={styles.testimonialCard}>
                <View style={styles.testimonialHeader}>
                  <View>
                    <Text style={styles.testimonialName}>{testimonial.name}</Text>
                    <Text style={styles.testimonialEvent}>{testimonial.event}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name="star"
                        size={16}
                        color={i < Math.floor(testimonial.rating) ? "#FFD700" : "#666"}
                      />
                    ))}
                    <Text style={styles.ratingText}>
                      {testimonial.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.testimonialComment}>"{testimonial.comment}"</Text>
              </View>
            ))}
          </View>
        );
      
      default:
        return (
          <View style={styles.homeContainer}>
            <ImageBackground
              source={{ uri: "https://via.placeholder.com/500x300" }}
              style={styles.heroBanner}
              resizeMode="cover"
            >
              <View style={styles.heroOverlay}>
                <Animated.Text
                  style={[
                    styles.heroTitle,
                    { opacity: fadeIn }
                  ]}
                >
                  IN SOUND
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.heroSubtitle,
                    { opacity: fadeIn }
                  ]}
                >
                  Experiencias Sonoras Excepcionales
                </Animated.Text>
                <Animated.View
                  style={[
                    styles.heroButtonContainer,
                    { transform: [{ translateX: slideText }] }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.heroButton}
                    onPress={() => setActiveSection("eventos")}
                  >
                    <Text style={styles.heroButtonText}>Ver Eventos</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </ImageBackground>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Bienvenido a IN SOUND</Text>
              <Text style={styles.infoText}>
                Con más de 10 años de experiencia, somos líderes en producción de audio y eventos en toda la República Mexicana. Nuestro equipo de profesionales está comprometido con la excelencia y la innovación.
              </Text>
            </View>

            <View style={styles.featuredServices}>
              <Text style={styles.featuredTitle}>Servicios Destacados</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesScroll}>
                {services.slice(0, 3).map((service) => (
                  <TouchableOpacity 
                    key={service.id} 
                    style={styles.servicePreview}
                    onPress={() => setActiveSection("servicios")}
                  >
                    <View style={styles.servicePreviewIcon}>
                      <FontAwesome5 name={service.icon} size={32} color="#5CE1E6" />
                    </View>
                    <Text style={styles.servicePreviewTitle}>{service.title}</Text>
                    <Text style={styles.servicePreviewDescription} numberOfLines={2}>
                      {service.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => setActiveSection("servicios")}
              >
                <Text style={styles.viewAllText}>Ver Todos los Servicios</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.featuredEvents}>
              <Text style={styles.featuredTitle}>Eventos Destacados</Text>
              {upcomingEvents.slice(0, 1).map((event) => (
                <TouchableOpacity 
                  key={event.id} 
                  style={styles.featuredEventCard}
                  onPress={() => setActiveSection("eventos")}
                >
                  <ImageBackground
                    source={{ uri: event.image }}
                    style={styles.featuredEventImage}
                    resizeMode="cover"
                  >
                    <View style={styles.eventOverlay}>
                      <Text style={styles.featuredEventTitle}>{event.title}</Text>
                      <View style={styles.featuredEventDetails}>
                        <View style={styles.eventDateContainer}>
                          <Ionicons name="calendar" size={16} color="#5CE1E6" />
                          <Text style={styles.featuredEventDate}>{event.date}</Text>
                        </View>
                        <View style={styles.eventLocationContainer}>
                          <Ionicons name="location" size={16} color="#5CE1E6" />
                          <Text style={styles.featuredEventLocation}>{event.location}</Text>
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => setActiveSection("eventos")}
              >
                <Text style={styles.viewAllText}>Ver Todos los Eventos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsSection}>
              <Text style={styles.statsTitle}>IN SOUND en Números</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>500+</Text>
                  <Text style={styles.statLabel}>Eventos Realizados</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>98%</Text>
                  <Text style={styles.statLabel}>Clientes Satisfechos</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>15+</Text>
                  <Text style={styles.statLabel}>Ciudades</Text>
                </View>
              </View>
            </View>

            
          </View>
        );
    }
  };

  const renderNavigation = () => (
    <View style={styles.navigationContainer}>
      <TouchableOpacity
        style={[
          styles.navButton,
          activeSection === "inicio" && styles.activeNavButton,
        ]}
        onPress={() => setActiveSection("inicio")}
      >
        <Ionicons
          name="home"
          size={20}
          color={activeSection === "inicio" ? "#5CE1E6" : "#FFFFFF"}
        />
        <Text
          style={[
            styles.navButtonText,
            activeSection === "inicio" && styles.activeNavText,
          ]}
        >
          Inicio
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navButton,
          activeSection === "eventos" && styles.activeNavButton,
        ]}
        onPress={() => setActiveSection("eventos")}
      >
        <Ionicons
          name="calendar"
          size={20}
          color={activeSection === "eventos" ? "#5CE1E6" : "#FFFFFF"}
        />
        <Text
          style={[
            styles.navButtonText,
            activeSection === "eventos" && styles.activeNavText,
          ]}
        >
          Eventos
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navButton,
          activeSection === "servicios" && styles.activeNavButton,
        ]}
        onPress={() => setActiveSection("servicios")}
      >
        <Ionicons
          name="musical-notes"
          size={20}
          color={activeSection === "servicios" ? "#5CE1E6" : "#FFFFFF"}
        />
        <Text
          style={[
            styles.navButtonText,
            activeSection === "servicios" && styles.activeNavText,
          ]}
        >
          Servicios
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navButton,
          activeSection === "testimonios" && styles.activeNavButton,
        ]}
        onPress={() => setActiveSection("testimonios")}
      >
        <Ionicons
          name="star"
          size={20}
          color={activeSection === "testimonios" ? "#5CE1E6" : "#FFFFFF"}
        />
        <Text
          style={[
            styles.navButtonText,
            activeSection === "testimonios" && styles.activeNavText,
          ]}
        >
          Testimonios
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Sidebar slideAnim={slideSidebar} onClose={toggleSidebar} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.logoContainer}
          onPress={() => setActiveSection("inicio")}
        >
          <Text style={styles.logo}>IN SOUND</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name="settings" size={28} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection()}
      </ScrollView>

      {renderNavigation()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
  content: {
    flex: 1,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#1E1E1E",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  activeNavButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#5CE1E6",
  },
  navButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
  },
  activeNavText: {
    color: "#5CE1E6",
    fontWeight: "bold",
  },
  
  // Home Section Styles
  homeContainer: {
    flex: 1,
  },
  heroBanner: {
    height: 300,
    justifyContent: "center",
  },
  heroOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "#5CE1E6",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroButtonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  heroButton: {
    backgroundColor: "#5CE1E6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  heroButtonText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 16,
  },
  infoSection: {
    padding: 25,
    backgroundColor: "#1A1A1A",
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: "#CCCCCC",
    lineHeight: 24,
  },
  featuredServices: {
    padding: 25,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  servicesScroll: {
    flexDirection: "row",
  },
  servicePreview: {
    width: 200,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  servicePreviewIcon: {
    alignItems: "center",
    marginBottom: 15,
  },
  servicePreviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  servicePreviewDescription: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
  },
  viewAllButton: {
    alignItems: "center",
    padding: 15,
    marginTop: 20,
  },
  viewAllText: {
    color: "#5CE1E6",
    fontSize: 16,
    fontWeight: "bold",
  },
  featuredEvents: {
    padding: 25,
    backgroundColor: "#1A1A1A",
  },
  featuredEventCard: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  featuredEventImage: {
    width: "100%",
    height: "100%",
  },
  eventOverlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
    justifyContent: "flex-end",
    height: "100%",
  },
  featuredEventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  featuredEventDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredEventDate: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 5,
  },
  eventLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredEventLocation: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 5,
  },
  statsSection: {
    padding: 25,
  },
  statsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    padding: 15,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5CE1E6",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  callToAction: {
    backgroundColor: "#1A1A1A",
    padding: 25,
    alignItems: "center",
    borderRadius: 12,
    margin: 20,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  ctaText: {
    fontSize: 16,
    color: "#CCCCCC",
    marginBottom: 20,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#5CE1E6",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  // Section Container Styles
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 25,
    textAlign: "center",
  },
  
  // Events Section Styles
  eventCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    overflow: "hidden",
  },
  eventHeader: {
    padding: 15,
    backgroundColor: "#222222",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: "#5CE1E6",
  },
  eventContent: {
    flexDirection: "row",
    padding: 15,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  eventDetails: {
    flex: 1,
    marginLeft: 15,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  eventLocation: {
    fontSize: 14,
    color: "#CCCCCC",
    marginLeft: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 15,
  },
  eventButton: {
    backgroundColor: "#5CE1E6",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  eventButtonText: {
    color: "#121212",
    fontWeight: "bold",
    fontSize: 12,
  },
  
  // Services Section Styles
  serviceCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#222222",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#AAAAAA",
    lineHeight: 20,
  },
  
  // Testimonials Section Styles
  testimonialCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  testimonialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  testimonialName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 3,
  },
  testimonialEvent: {
    fontSize: 14,
    color: "#5CE1E6",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 5,
    color: "#FFD700",
    fontWeight: "bold",
  },
  testimonialComment: {
    fontSize: 16,
    color: "#CCCCCC",
    fontStyle: "italic",
    lineHeight: 22,
  },
});

export default HomeScreen;