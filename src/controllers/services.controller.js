
const ServiceManager = require('../managers/ServiceManager');

const getServices = (req, res) => {
  try {
    const services = ServiceManager.getServices();
    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener los servicios'
    });
  }
};

const getServiceById = (req, res) => {
  try {
    const { sid } = req.params;
    const service = ServiceManager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json(service);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el servicio'
    });
  }
};

const createService = (req, res) => {
  try {
    const {
      name,
      description,
      duration,
      price,
      category,
      available
    } = req.body;

    const errors = [];

    if (typeof name !== 'string' || !name.trim()) {
      errors.push('name es obligatorio y debe ser texto');
    }

    if (typeof description !== 'string' || !description.trim()) {
      errors.push('description es obligatorio y debe ser texto');
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      errors.push('duration debe ser un número entero mayor que 0');
    }

    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
      errors.push('price debe ser un número mayor o igual a 0');
    }

    if (typeof category !== 'string' || !category.trim()) {
      errors.push('category es obligatorio y debe ser texto');
    }

    if (available !== undefined && typeof available !== 'boolean') {
      errors.push('available debe ser un valor booleano');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const service = ServiceManager.addService({
      name: name.trim(),
      description: description.trim(),
      duration,
      price,
      category: category.trim(),
      available
    });

    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear el servicio'
    });
  }
};

const updateService = (req, res) => {
  try {
    const { sid } = req.params;
    const changes = req.body;

    if (!changes || typeof changes !== 'object' || Array.isArray(changes)) {
      return res.status(400).json({
        message: 'El cuerpo de la petición debe ser un objeto'
      });
    }

    const allowedFields = [
      'name',
      'description',
      'duration',
      'price',
      'category',
      'available'
    ];

    const keys = Object.keys(changes);

    if (keys.length === 0) {
      return res.status(400).json({
        message: 'Debes enviar al menos un campo para actualizar'
      });
    }

    const invalidFields = keys.filter(key => !allowedFields.includes(key));

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: 'Hay campos que no se pueden actualizar',
        fields: invalidFields
      });
    }

    const errors = [];

    if (
      changes.name !== undefined &&
      (typeof changes.name !== 'string' || !changes.name.trim())
    ) {
      errors.push('name debe ser un texto no vacío');
    }

    if (
      changes.description !== undefined &&
      (typeof changes.description !== 'string' ||
        !changes.description.trim())
    ) {
      errors.push('description debe ser un texto no vacío');
    }

    if (
      changes.duration !== undefined &&
      (!Number.isInteger(changes.duration) || changes.duration <= 0)
    ) {
      errors.push('duration debe ser un número entero mayor que 0');
    }

    if (
      changes.price !== undefined &&
      (typeof changes.price !== 'number' ||
        !Number.isFinite(changes.price) ||
        changes.price < 0)
    ) {
      errors.push('price debe ser un número mayor o igual a 0');
    }

    if (
      changes.category !== undefined &&
      (typeof changes.category !== 'string' || !changes.category.trim())
    ) {
      errors.push('category debe ser un texto no vacío');
    }

    if (
      changes.available !== undefined &&
      typeof changes.available !== 'boolean'
    ) {
      errors.push('available debe ser un valor booleano');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const normalizedChanges = { ...changes };

    if (typeof normalizedChanges.name === 'string') {
      normalizedChanges.name = normalizedChanges.name.trim();
    }

    if (typeof normalizedChanges.description === 'string') {
      normalizedChanges.description = normalizedChanges.description.trim();
    }

    if (typeof normalizedChanges.category === 'string') {
      normalizedChanges.category = normalizedChanges.category.trim();
    }

    const updatedService = ServiceManager.updateService(
      sid,
      normalizedChanges
    );

    if (!updatedService) {
      return res.status(404).json({
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json(updatedService);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar el servicio'
    });
  }
};

const deleteService = (req, res) => {
  try {
    const { sid } = req.params;
    const deletedService = ServiceManager.deleteService(sid);

    if (!deletedService) {
      return res.status(404).json({
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json({
      message: 'Servicio eliminado correctamente',
      service: deletedService
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el servicio'
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
