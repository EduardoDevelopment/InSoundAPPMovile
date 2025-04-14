require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const eventReservationRoutes = require('./routes/event_reservations'); // Importar el archivo de rutas para reservas de eventos

const app = express();
app.use(express.json());

// Usamos las rutas combinadas
app.use('/api/auth', authRoutes);
app.use('/api/event-reservations', eventReservationRoutes); // Usar las rutas de reservas de eventos

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});