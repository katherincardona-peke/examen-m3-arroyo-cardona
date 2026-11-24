const app = require('./app');

const PORT = Number(process.env.PORT) || 3011;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`ms-cursos escuchando en http://${HOST}:${PORT}`);
});
