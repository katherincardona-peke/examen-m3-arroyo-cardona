// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador
// y decide qué rutas exigen token y quién puede usarlas.
// =====================================================================
const { Router } = require('express');
const controller = require('../controllers/cursos.controller');
const { verificarToken, requiereRol } = require('../middlewares/auth');

const router = Router();

// Todas las rutas exigen un token válido
router.use(verificarToken);

// Consultas: cualquier rol
router.get('/', controller.listar);
router.get('/:id', controller.obtener);

// Crear, actualizar y eliminar: solo el administrador
router.post('/', requiereRol('administrador'), controller.crear);
router.put('/:id', requiereRol('administrador'), controller.actualizar);
router.delete('/:id', requiereRol('administrador'), controller.eliminar);

module.exports = router;
