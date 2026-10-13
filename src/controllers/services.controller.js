
const ServiceManager = require('../managers/ServiceManager');

function isObjectBody(body) {
  return body !== null &&
    typeof body === 'object' &&
    !Array.isArray(body);
}

function validateService(data) {
  const errors = [];

  if (typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('name debe ser un texto no vacío');
  }

  if (
    typeof data.description !== 'string' ||
    !data.description.trim()
  ) {
    errors.push('description debe ser un texto no vacío');
  }

  if (!Number.isInteger(data.duration) || data.duration <= 0) {
    errors.push('duration debe ser un número entero mayor que 0');
  }

  if (
    typeof data.price !== 'number' ||
    !Number.isFinite(data.price) ||
    data.price < 0
  ) {
    errors.push('price debe ser un número mayor o igual a 0');
  }

  if (typeof data.category !== 'string' || !data.category.trim()) {
    errors.push('category debe ser un texto no vacío');
  }

  if (typeof data.available !== 'boolean') {
    errors.push('available debe ser true o false');
  }

  return errors;
}

const getServices = (req, res) => {
  try {
    return res.status(200).json({
      status: 'success',
      data: ServiceManager.getServices()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener los servicios'
    });
  }
};

const getServiceById = (req, res) => {
  try {
    const service = ServiceManager.getServiceById(req.params.sid);

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: service
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener el servicio'
    });
  }
};

const createService = (req, res) => {
  try {
    if (!isObjectBody(req.body)) {
      return res.status(400).json({
        status: 'error',
        message: 'El cuerpo debe ser un objeto JSON'
      });
    }

    if (Object.hasOwn(req.body, 'id')) {
      return res.status(400).json({
        status: 'error',
        message: 'El id se genera automáticamente y no debe enviarse'
      });
    }

    const errors = validateService(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Datos del servicio inválidos',
        errors
      });
    }

    const service = ServiceManager.addService({
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      duration: req.body.duration,
      price: req.body.price,
      category: req.body.category.trim(),
      available: req.body.available
    });

    return res.status(201).json({
      status: 'success',
      message: 'Servicio creado correctamente',
      data: service
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al crear el servicio'
    });
  }
};

const updateService = (req, res) => {
  try {
    if (!isObjectBody(req.body)) {
      return res.status(400).json({
        status: 'error',
        message: 'El cuerpo debe ser un objeto JSON'
      });
    }

    if (Object.hasOwn(req.body, 'id')) {
      return res.status(400).json({
        status: 'error',
        message: 'No se permite modificar el id'
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

    // PUT exige todos los campos del servicio.
    const errors = validateService(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Todos los campos del servicio son obligatorios',
        errors
      });
    }

    const updatedService = ServiceManager.updateService(
      req.params.sid,
      {
        name: req.body.name.trim(),
        description: req.body.description.trim(),
        duration: req.body.duration,
        price: req.body.price,
        category: req.body.category.trim(),
        available: req.body.available
      }
    );

    if (!updatedService) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Servicio actualizado correctamente',
      data: updatedService
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el servicio'
    });
  }
};

const deleteService = (req, res) => {
  try {
    const deletedService = ServiceManager.deleteService(req.params.sid);

    if (!deletedService) {
      return res.status(404).json({
        status: 'error',
        message: 'Servicio no encontrado'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Servicio eliminado correctamente',
      data: deletedService
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
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
