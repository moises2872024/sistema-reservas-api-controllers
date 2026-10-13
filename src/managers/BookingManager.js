
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const DATA_PATH = path.join(__dirname, '../data/bookings.json');

class BookingManager {
  constructor() {
    this.initializeFile();
  }

  initializeFile() {
    const directory = path.dirname(DATA_PATH);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(DATA_PATH, '[]', 'utf8');
    }
  }

  readFile() {
    this.initializeFile();

    const content = fs.readFileSync(DATA_PATH, 'utf8');
    return JSON.parse(content || '[]');
  }

  writeFile(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
  }

  createBooking(bookingData) {
    const bookings = this.readFile();

    const newBooking = {
      id: randomUUID(),
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status || 'pending',
      services: []
    };

    bookings.push(newBooking);
    this.writeFile(bookings);

    return newBooking;
  }

  getBookingById(bid) {
    const bookings = this.readFile();
    return bookings.find(booking => booking.id === bid) || null;
  }

  addServiceToBooking(bid, sid) {
    const bookings = this.readFile();
    const booking = bookings.find(item => item.id === bid);

    if (!booking) {
      return { error: 'Reserva no encontrada', status: 404 };
    }

    const ServiceManager = require('./ServiceManager');
    const service = ServiceManager.getServiceById(sid);

    if (!service) {
      return { error: 'Servicio no encontrado', status: 404 };
    }

    if (!service.available) {
      return { error: 'El servicio no está disponible', status: 400 };
    }

    if (!Array.isArray(booking.services)) {
      booking.services = [];
    }

    const existingService = booking.services.find(
      item => item.service === sid
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      booking.services.push({
        service: sid,
        quantity: 1
      });
    }

    this.writeFile(bookings);

    return booking;
  }
}

module.exports = new BookingManager();
