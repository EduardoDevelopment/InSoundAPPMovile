const express = require('express');
const router = express.Router();
const eventReservationsController = require('../controllers/event_reservations');

// Obtener todas las reservas de eventos
router.get('/', eventReservationsController.getAllReservations);

// Obtener una reserva de evento por ID
router.get('/:id', eventReservationsController.getReservationById);

// Crear una nueva reserva de evento
router.post('/', eventReservationsController.createReservation);

// Actualizar una reserva de evento por ID
router.put('/:id', eventReservationsController.updateReservation);

// Eliminar una reserva de evento por ID
router.delete('/:id', eventReservationsController.deleteReservation);

module.exports = router;