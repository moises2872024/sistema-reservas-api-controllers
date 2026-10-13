# Sistema de Reservas API — Controllers

## Descripción

API REST desarrollada con Node.js y Express para administrar servicios y reservas. El proyecto organiza el código en tres capas: Routes, Controllers y Managers.

Los datos se almacenan en archivos JSON mediante el módulo File System de Node.js.

## Tecnologías

- Node.js
- Express
- JavaScript
- Archivos JSON
- Postman

## Instalación

Requisitos: Node.js y npm.

Clona el repositorio:

```bash
git clone https://github.com/moises2872024/sistema-reservas-api-controllers.git
cd sistema-reservas-api-controllers
```

Instala las dependencias:

```bash
npm install
```

## Ejecución

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

La API utiliza el puerto 3000 de forma predeterminada.

## Arquitectura del proyecto

- `src/routes/`: define los endpoints con Express Router y los conecta con sus controladores.
- `src/controllers/`: recibe las peticiones HTTP, valida los datos, llama a los managers y devuelve las respuestas.
- `src/managers/`: contiene la lógica de gestión de servicios y reservas, incluida la persistencia.
- `src/data/`: almacena los archivos JSON.
- `src/config/env.config.js`: configura el puerto.
- `src/app.js`: configura Express y registra los routers.
- `src/server.js`: inicia el servidor.

## Endpoints de servicios

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Obtener todos los servicios |
| GET | `/api/services/:sid` | Obtener un servicio por ID |
| POST | `/api/services` | Crear un servicio |
| PUT | `/api/services/:sid` | Actualizar un servicio |
| DELETE | `/api/services/:sid` | Eliminar un servicio |

## Endpoints de reservas

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/bookings` | Crear una reserva |
| GET | `/api/bookings/:bid` | Obtener una reserva por ID |
| POST | `/api/bookings/:bid/services/:sid` | Agregar un servicio a una reserva |

## Respuestas HTTP

- `200 OK`: consulta, actualización, eliminación o asociación exitosa.
- `201 Created`: servicio o reserva creada correctamente.
- `400 Bad Request`: datos de entrada inválidos.
- `404 Not Found`: servicio o reserva no encontrada.
- `409 Conflict`: intento de agregar un servicio que no está disponible.
- `500 Internal Server Error`: error interno del servidor.

## Ejemplo de servicio

Para crear un servicio, realiza una petición `POST` a `/api/services` con un cuerpo JSON:

```json
{
  "name": "Corte de cabello",
  "description": "Corte tradicional para adultos",
  "duration": 30,
  "price": 10000,
  "category": "Peluquería",
  "available": true
}
```

## Ejemplo de reserva

Para crear una reserva, realiza una petición `POST` a `/api/bookings`:

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@example.com",
  "date": "2026-11-15",
  "time": "10:30"
}
```

## Pruebas

Los endpoints se probaron con Postman, verificando las operaciones de creación, consulta, actualización, eliminación y asociación de servicios a reservas.

## Persistencia

Los datos se guardan en `src/data/services.json` y `src/data/bookings.json`.

## Configuración y seguridad

El archivo `.env.example` documenta la variable `PORT`. El archivo `.gitignore` excluye `node_modules/` y `.env`.

Proyecto académico desarrollado con Node.js y Express.