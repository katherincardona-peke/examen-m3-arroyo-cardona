// =====================================================================
// CLIENTE HTTP de ms-salones (proveedor), para ms-cursos.
// En el .env de ms-cursos:  SALONES_URL=http://127.0.0.1:3012
// =====================================================================
const HttpError = require('../utils/http-error');
const SALONES_URL = process.env.SALONES_URL;

// Hace una petición GET a ms-salones reenviando el token del usuario.
// Devuelve la respuesta de fetch, o null si ms-salones no respondió.
async function pedir(ruta, token) {
  try {
    return await fetch(SALONES_URL + ruta, {
      headers: { Authorization: token },     // el token de la petición original
      signal: AbortSignal.timeout(3000),      // no esperar más de 3 segundos
    });
  } catch (error) {
    return null;                              // ms-salones caído o sin responder
  }
}

// VALIDACIÓN y REGLA (crear y actualizar): devuelve el salón,
// o lanza 400 si no existe, 503 si ms-salones no responde, 502 si responde mal
async function obtenerSalon(id, token) {
  const respuesta = await pedir('/salones/' + id, token);
  if (!respuesta) throw new HttpError(503, 'ms-salones no está disponible');
  if (respuesta.status === 404) throw new HttpError(400, 'No existe el salón con id ' + id);
  if (!respuesta.ok) throw new HttpError(502, 'Respuesta inválida de ms-salones');
  return respuesta.json();
}

// COMPOSICIÓN (GET por id y listado): UNA sola petición con ?ids=
// Devuelve un arreglo de salones, o null si ms-salones no responde
async function obtenerSalones(ids, token) {
  if (ids.length === 0) return [];
  const respuesta = await pedir('/salones?ids=' + ids.join(','), token);
  if (!respuesta || !respuesta.ok) return null;
  return respuesta.json();
}

module.exports = { pedir, obtenerSalon, obtenerSalones };
