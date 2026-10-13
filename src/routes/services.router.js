
const express = require('express');
const router = express.Router();

const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/services.controller');

router.get('/', getServices);
router.get('/:sid', getServiceById);
router.post('/', createService);
router.put('/:sid', updateService);
router.delete('/:sid', deleteService);

module.exports = router;
