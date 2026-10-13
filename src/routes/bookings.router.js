
const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookingById,
  addServiceToBooking
} = require('../controllers/bookings.controller');

router.post('/', createBooking);
router.get('/:bid', getBookingById);
router.post('/:bid/services/:sid', addServiceToBooking);

module.exports = router;
