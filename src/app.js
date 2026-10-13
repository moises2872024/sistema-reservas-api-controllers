
const express = require('express');

const servicesRouter = require('./routes/services.router');
const bookingsRouter = require('./routes/bookings.router');

const app = express();

app.use(express.json());

app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API de reservas funcionando correctamente'
  });
});

module.exports = app;
