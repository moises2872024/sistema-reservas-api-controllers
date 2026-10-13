
const BookingManager = require('../managers/BookingManager');
const ServiceManager = require('../managers/ServiceManager');

function isObjectBody(body) {
  return body !== null &&
    typeof body === 'object' &&
    !Array.isArray(body);
}

function isValidDate(date) {
  if (
    typeof date !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}

function validateBooking(data) {
  const errors = [];

  if (
    typeof data.clientName !== 'string' ||
    !data.clientName.trim()
  ) {
    errors.push('clientName debe ser un texto no vacío');
  }

  if (
    typeof data.clientEmail !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)
  ) {
    errors.push('clientEmail debe ser un correo electrónico válido');
  }

  if (!isValidDate(data.date)) {
    errors.push('date debe ser una fecha válida con formato AAAA-MM-DD');
  }

  if (
    typeof data.time !== 'string' ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time)
  ) {
    errors.push('time debe tener el formato HH:mm');
  }

  if (
    data.status !== undefined &&
    (
      typeof data.status !== 'string' ||
      !data.status.trim()
    )
  ) {
    errors.push('status debe ser un texto no vacío');
  }

  return errors;
}

const createBooking = (req, res) => {
  try {
    if (!isObjectBody(req.body)) {
      return res.status(400).json({
        status: 'error',
        message: 'El cuerpo debe ser un objeto JSON'
      });
    }

    const allowedFields = [
      'clientName',
      'clientEmail',
      'date',
      'time',
      'status'
    ];

    const unknownFields = Object.keys(req.body).filter(
      field => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Hay campos no permitidos',
        fields: unknownFields
      });
    }

    const errors = validateBooking(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Datos de la reserva inválidos',
        errors
      });
    }

    const booking = BookingManager.createBooking({
      clientName: req.body.clientName.trim(),
      clientEmail: req.body.clientEmail.trim(),
      date: req.body.date,
      time: req.body.time,
      status: req.body.status
        ? req.body.status.trim()
        : 'pending'
    });

    return res.status(201).json({
      status: 'success',
      message: 'Reserva creada correctamente',
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al crear la reserva'
    });
  }
};

const getBookingById = (req, res) => {
  try {
    const booking = BookingManager.getBookingById(req.params.bid);

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Reserva no encontrada'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener la reserva'
    });
  }
};

const addServiceToBooking = (req, res) => {
  try {
    const { bid, sid } = req.params;

    // Mantener el orden de validación del proyecto original.
    const booking = BookingManager.getBookingById(bid);

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Reserva no encontrada'
      });
    }

    // La existencia y disponibilidad del servicio se verifican
    // mediante ServiceManager antes de modificar la reserva.
    const service = ServiceManager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    if (!service.available) {
      return res.status(409).json({
        status: 'error',
        message: 'El servicio no está disponible'
      });
    }

    const result = BookingManager.addServiceToBooking(bid, sid);

    // Respaldo ante posibles errores devueltos por el manager.
    if (result && result.error) {
      if (
        result.error === 'Reserva no encontrada' ||
        result.error === 'BOOKING_NOT_FOUND'
      ) {
        return res.status(404).json({
          status: 'error',
          message: 'Reserva no encontrada'
        });
      }

      if (
        result.error === 'Servicio no encontrado' ||
        result.error === 'SERVICE_NOT_FOUND'
      ) {
        return res.status(404).json({
          status: 'error',
          message: 'Servicio no encontrado'
        });
      }

      if (
        result.error === 'El servicio no está disponible' ||
        result.error === 'SERVICE_NOT_AVAILABLE'
      ) {
        return res.status(409).json({
          status: 'error',
          message: 'El servicio no está disponible'
        });
      }

      return res.status(result.status || 400).json({
        status: 'error',
        message: result.error
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Servicio agregado a la reserva correctamente',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al agregar el servicio a la reserva'
    });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  addServiceToBooking
};
