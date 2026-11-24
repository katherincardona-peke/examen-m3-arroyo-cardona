// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Reglas del negocio, validación de la relación con ms-salones
// y composición del objeto salon en las respuestas.
// =====================================================================
const repo = require('../repositories/cursos.repository');
const { validarCurso, construirCurso } = require('../models/curso');
const HttpError = require('../utils/http-error');
const salonesClient = require('../clients/salones.client');

// Objeto compuesto de la ficha: salon { id, codigo_salon, edificio }
function aSalon(s) {
  if (!s) return null;
  return { id: s.id, codigo_salon: s.codigo_salon, edificio: s.edificio };
}

// Composición: UNA sola petición a ms-salones para toda la lista.
// Si ms-salones no responde, salon queda en null con un aviso.
async function componer(cursos, token) {
  const ids = [...new Set(cursos.map((c) => c.salon_id))];
  const salones = await salonesClient.obtenerSalones(ids, token);
  if (salones === null) {
    return cursos.map((c) => ({ ...c, salon: null, aviso: 'ms-salones no está disponible' }));
  }
  const mapa = new Map(salones.map((s) => [s.id, s]));
  return cursos.map((c) => ({ ...c, salon: aSalon(mapa.get(c.salon_id)) }));
}

// Validación de la relación (400 no existe / 503 caído) y regla de negocio:
// el cupo del curso no puede superar la capacidad del salón (400)
async function validarSalon(curso, token) {
  const salon = await salonesClient.obtenerSalon(curso.salon_id, token);
  if (curso.cupo > salon.capacidad) {
    throw new HttpError(400, 'El cupo (' + curso.cupo + ') supera la capacidad del salón '
      + salon.codigo_salon + ' (' + salon.capacidad + ')');
  }
  return salon;
}

async function listar(filtros, token) {
  const cursos = await repo.findAll(filtros);
  return componer(cursos, token);
}

async function obtener(id, token) {
  const curso = await repo.findById(id);
  if (!curso) throw new HttpError(404, 'No existe el curso con id ' + id);
  const [compuesto] = await componer([curso], token);
  return compuesto;
}

async function crear(datos, token) {
  const errores = validarCurso(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);
  const curso = construirCurso(datos);

  // Regla: no puede haber dos cursos con el mismo código
  if (await repo.findByCodigo(curso.codigo)) {
    throw new HttpError(409, 'Ya existe un curso con el código ' + curso.codigo);
  }
  const salon = await validarSalon(curso, token);
  const nuevo = await repo.create(curso);
  return { ...nuevo, salon: aSalon(salon) };
}

async function actualizar(id, datos, token) {
  const errores = validarCurso(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);
  const curso = construirCurso(datos);

  if (!(await repo.findById(id))) throw new HttpError(404, 'No existe el curso con id ' + id);

  // El código puede quedar igual, pero no puede ser el de OTRO curso
  const otro = await repo.findByCodigo(curso.codigo);
  if (otro && otro.id !== id) {
    throw new HttpError(409, 'Ya existe un curso con el código ' + curso.codigo);
  }
  const salon = await validarSalon(curso, token);
  const actualizado = await repo.update(id, curso);
  return { ...actualizado, salon: aSalon(salon) };
}

async function eliminar(id) {
  const eliminado = await repo.remove(id);
  if (!eliminado) throw new HttpError(404, 'No existe el curso con id ' + id);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
