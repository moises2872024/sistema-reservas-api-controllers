
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const DATA_PATH = path.join(__dirname, '../data/services.json');

class ServiceManager {
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

  getServices() {
    return this.readFile();
  }

  getServiceById(sid) {
    const services = this.readFile();
    return services.find(service => service.id === sid) || null;
  }

  addService(serviceData) {
    const services = this.readFile();

    const newService = {
      id: randomUUID(),
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available ?? true
    };

    services.push(newService);
    this.writeFile(services);

    return newService;
  }

  updateService(sid, changes) {
    const services = this.readFile();
    const index = services.findIndex(service => service.id === sid);

    if (index === -1) {
      return null;
    }

    services[index] = {
      ...services[index],
      ...changes,
      id: services[index].id
    };

    this.writeFile(services);

    return services[index];
  }

  deleteService(sid) {
    const services = this.readFile();
    const index = services.findIndex(service => service.id === sid);

    if (index === -1) {
      return null;
    }

    const [deletedService] = services.splice(index, 1);
    this.writeFile(services);

    return deletedService;
  }
}

module.exports = new ServiceManager();
