// =====================================================================
// CAPA DE MODELO (entidad)
// Define qué campos tiene un Curso y qué reglas deben cumplir.
// =====================================================================

// Semestre: cuatro dígitos, un guion y 1 o 2. Ejemplos: 2026-1, 2026-2
const SEMESTRE_VALIDO = /^\d{4}-[12]$/;

function textoValido(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

// Devuelve una lista de errores de validación (vacía si todo está bien)
function validarCurso(datos) {
  const errores = [];
  if (!datos || typeof datos !== 'object') {
    return ['Se esperaba un objeto JSON con los datos del curso'];
  }
  if (!textoValido(datos.codigo)) errores.push('codigo es obligatorio');
  if (!textoValido(datos.nombre)) errores.push('nombre es obligatorio');
  if (!Number.isInteger(datos.creditos) || datos.creditos < 1 || datos.creditos > 6) {
    errores.push('creditos debe ser un entero entre 1 y 6');
  }
  if (!Number.isInteger(datos.cupo) || datos.cupo <= 0) {
    errores.push('cupo debe ser un entero mayor que 0');
  }
  if (typeof datos.semestre !== 'string' || !SEMESTRE_VALIDO.test(datos.semestre.trim())) {
    errores.push('semestre debe tener el formato AAAA-1 o AAAA-2');
  }
  // Atributo de referencia (ficha 02): id del salón en ms-salones
  if (!Number.isInteger(datos.salon_id) || datos.salon_id <= 0) {
    errores.push('salon_id es obligatorio y debe ser un entero positivo');
  }
  return errores;
}

// Construye un curso "limpio" solo con los campos permitidos
function construirCurso(datos) {
  return {
    codigo: datos.codigo.trim().toUpperCase(),
    nombre: datos.nombre.trim(),
    creditos: datos.creditos,
    cupo: datos.cupo,
    semestre: datos.semestre.trim(),
    salon_id: datos.salon_id,
  };
}

module.exports = { validarCurso, construirCurso, SEMESTRE_VALIDO };
