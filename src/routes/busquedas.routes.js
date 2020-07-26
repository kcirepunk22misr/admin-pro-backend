/**
 *  RUTA: /api/todo
 */

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
	getBusqueda,
	getDocumentoColeccion,
} = require('../controllers/busqueda');

const router = Router();

router.get('/:busqueda', validarJWT, getBusqueda);
router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentoColeccion);

module.exports = router;
