const EventReservation = require('../models/event_reservations');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await EventReservation.findAll({
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ 
      error: 'Error fetching reservations',
      details: error.message 
    });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await EventReservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ 
      error: 'Error fetching reservation',
      details: error.message 
    });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const newReservation = await EventReservation.create(req.body);
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(400).json({ 
      error: 'Error creating reservation',
      details: error.errors?.map(e => e.message) || error.message 
    });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const [updated] = await EventReservation.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    const updatedReservation = await EventReservation.findByPk(req.params.id);
    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(400).json({ 
      error: 'Error updating reservation',
      details: error.errors?.map(e => e.message) || error.message 
    });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const deleted = await EventReservation.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ 
      error: 'Error deleting reservation',
      details: error.message 
    });
  }
};