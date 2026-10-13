
const BookingManager = require('../managers/BookingManager');
const ServiceManager = require('../managers/ServiceManager');

const createBooking = (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      date,
      time,
      status
    } = req.body;

    const errors = [];

    if (typeof clientName !== 'string' || !clientName.trim()) {
      errors.push('clientName es obligatorio');
    }

    if (
      typeof clientEmail !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)
    ) {
      errors.push('clientEmail debe ser un correo electrónico válido');
    }

    if (
      typeof date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ||
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
    ) {
      errors.push('date debe tener el formato YYYY-MM-DD');
    }

    if (
      typeof time !== 'string' ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
    ) {
      errors.push('time debe tener el formato HH:mm');
    }

    const allowedStatuses = ['pending', 'confirmed', 'cancelled'];

    if (status !== undefined && !allowedStatuses.includes(status)) {
      errors.push('status debe ser pending, confirmed o cancelled');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const booking = BookingManager.createBooking({
      clientName: clientName.trim(),
      clientEmail,
      date,
      time,
      status
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear la reserva'
    });
  }
};

const getBookingById = (req, res) => {
  try {
    const { bid } = req.params;
    const booking = BookingManager.getBookingById(bid);

    if (!booking) {
      return res.status(404).json({
        message: 'Reserva no encontrada'
      });
    }

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la reserva'
    });
  }
};

const addServiceToBooking = (req, res) => {
  try {
    const { bid, sid } = req.params;

    // Comprobar que el servicio exista antes de añadirlo.
    const service = ServiceManager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        message: 'Servicio no encontrado'
      });
    }

    const result = BookingManager.addServiceToBooking(bid, sid);

    if (result && result.error) {
      return res.status(result.status || 400).json({
        message: result.error
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al agregar el servicio a la reserva'
    });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  addServiceToBooking
};
