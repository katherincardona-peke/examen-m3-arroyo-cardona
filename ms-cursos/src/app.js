// =====================================================================
// ms-cursos · punto de armado de la aplicación Express
// Aquí se registran los middlewares, las rutas y el manejo de errores.
// =====================================================================
const express = require('express');
const cors = require('cors');
const cursosRoutes = require('./routes/cursos.routes');

const app = express();

app.use(cors());

// Registro de peticiones en la terminal: método, ruta y código de respuesta
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode}`);
  });
  next();
});

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ servicio: 'ms-cursos', estado: 'ok' });
});

app.use('/cursos', cursosRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: err.message, detalles: err.detalles });
});

module.exports = app;
