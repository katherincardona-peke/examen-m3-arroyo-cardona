// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Reglas del negocio y validaciones.
// No sabe nada de HTTP (req/res) ni de cómo se guardan los datos.
// =====================================================================
const repo = require('../repositories/cursos.repository');
const { validarCurso, construirCurso } = require('../models/curso');
const HttpError = require('../utils/http-error');

async function listar(filtros) {
  return repo.findAll(filtros);
}

async function obtener(id) {
  const curso = await repo.findById(id);
  if (!curso) throw new HttpError(404, `No existe el curso con id ${id}`);
  return curso;
}

async function crear(datos) {
  const errores = validarCurso(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);
  const curso = construirCurso(datos);

  // Regla de negocio: no puede haber dos cursos con el mismo código
  if (await repo.findByCodigo(curso.codigo)) {
    throw new HttpError(409, `Ya existe un curso con el código ${curso.codigo}`);
  }
  return repo.create(curso);
}

async function actualizar(id, datos) {
  const errores = validarCurso(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);
  const curso = construirCurso(datos);

  // El código puede quedar igual, pero no puede ser el de OTRO curso
  const otro = await repo.findByCodigo(curso.codigo);
  if (otro && otro.id !== id) {
    throw new HttpError(409, `Ya existe un curso con el código ${curso.codigo}`);
  }

  const actualizado = await repo.update(id, curso);
  if (!actualizado) throw new HttpError(404, `No existe el curso con id ${id}`);
  return actualizado;
}

async function eliminar(id) {
  const eliminado = await repo.remove(id);
  if (!eliminado) throw new HttpError(404, `No existe el curso con id ${id}`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
