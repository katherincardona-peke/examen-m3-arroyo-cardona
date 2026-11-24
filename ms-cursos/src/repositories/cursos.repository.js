// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio) — versión MySQL
// Única capa que sabe dónde y cómo se guardan los datos.
// =====================================================================
const pool = require('../db');

async function findAll(filtros = {}) {
  let sql = 'SELECT * FROM cursos';
  const condiciones = [];
  const valores = [];
  if (filtros.semestre) {
    condiciones.push('semestre = ?');
    valores.push(filtros.semestre);
  }
  if (filtros.ids) {
    condiciones.push('id IN (?)');
    valores.push(filtros.ids);
  }
  if (condiciones.length > 0) sql += ' WHERE ' + condiciones.join(' AND ');
  const [filas] = await pool.query(sql + ' ORDER BY id', valores);
  return filas;
}

async function findById(id) {
  const [filas] = await pool.query('SELECT * FROM cursos WHERE id = ?', [id]);
  return filas.length > 0 ? filas[0] : null;
}

async function findByCodigo(codigo) {
  const [filas] = await pool.query('SELECT * FROM cursos WHERE codigo = ?', [codigo]);
  return filas.length > 0 ? filas[0] : null;
}

async function create(curso) {
  const [resultado] = await pool.query(
    'INSERT INTO cursos (codigo, nombre, creditos, cupo, semestre, salon_id) VALUES (?, ?, ?, ?, ?, ?)',
    [curso.codigo, curso.nombre, curso.creditos, curso.cupo, curso.semestre, curso.salon_id]);
  return findById(resultado.insertId);
}

async function update(id, curso) {
  const [resultado] = await pool.query(
    'UPDATE cursos SET codigo = ?, nombre = ?, creditos = ?, cupo = ?, semestre = ?, salon_id = ? WHERE id = ?',
    [curso.codigo, curso.nombre, curso.creditos, curso.cupo, curso.semestre, curso.salon_id, id]);
  if (resultado.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id) {
  const [resultado] = await pool.query('DELETE FROM cursos WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { findAll, findById, findByCodigo, create, update, remove };
