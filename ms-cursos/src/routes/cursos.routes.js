// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// GET para cualquier rol autenticado; POST, PUT y DELETE solo administrador
// =====================================================================
const { Router } = require('express');
const controller = require('../controllers/cursos.controller');
const { verificarToken, requiereRol } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);

router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.post('/', requiereRol('administrador'), controller.crear);
router.put('/:id', requiereRol('administrador'), controller.actualizar);
router.delete('/:id', requiereRol('administrador'), controller.eliminar);

module.exports = router;
