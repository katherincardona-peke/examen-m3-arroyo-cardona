// =====================================================================
// CAPA DE PRESENTACIÓN (controlador)
// Traduce HTTP <-> servicio: lee la petición y arma la respuesta.
// =====================================================================
const service = require('../services/cursos.service');
const { SEMESTRE_VALIDO } = require('../models/curso');
const HttpError = require('../utils/http-error');

function leerId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'El id debe ser un entero positivo');
  return id;
}

// GET /cursos, GET /cursos?semestre=2026-2, GET /cursos?ids=1,2,3
async function listar(req, res) {
  const filtros = {};
  if (req.query.semestre !== undefined) {
    filtros.semestre = String(req.query.semestre).trim();
    if (!SEMESTRE_VALIDO.test(filtros.semestre)) {
      throw new HttpError(400, 'semestre debe tener el formato AAAA-1 o AAAA-2');
    }
  }
  if (req.query.ids) {
    filtros.ids = String(req.query.ids).split(',').map(Number);
    if (filtros.ids.some((id) => !Number.isInteger(id) || id <= 0)) {
      throw new HttpError(400, 'ids debe ser una lista de enteros separados por comas');
    }
  }
  res.status(200).json(await service.listar(filtros));
}

// GET /cursos/:id
async function obtener(req, res) {
  res.status(200).json(await service.obtener(leerId(req)));
}

// POST /cursos
async function crear(req, res) {
  const nuevo = await service.crear(req.body);
  res.status(201).location(`${req.baseUrl}/${nuevo.id}`).json(nuevo);
}

// PUT /cursos/:id
async function actualizar(req, res) {
  res.status(200).json(await service.actualizar(leerId(req), req.body));
}

// DELETE /cursos/:id
async function eliminar(req, res) {
  await service.eliminar(leerId(req));
  res.status(204).end();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
