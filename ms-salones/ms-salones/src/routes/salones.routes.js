// CAPA DE PRESENTACIÓN: rutas de salones (solo lectura, cualquier rol autenticado)
const { Router } = require('express');
const controller = require('../controllers/salones.controller');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);                // todas las rutas exigen token

router.get('/', controller.listar);       // GET /salones  y  GET /salones?ids=1,3
router.get('/:id', controller.obtener);   // GET /salones/:id

module.exports = router;
