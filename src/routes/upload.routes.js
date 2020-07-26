/**
 *  RUTA: /api/uploads
 */

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornarImagen } = require('../controllers/uploads');
const expressFileUpload = require('express-fileupload');

const router = Router();
router.use(expressFileUpload());
router.put('/:tipo/:id', validarJWT, fileUpload);
router.get('/:tipo/:foto', retornarImagen);

module.exports = router;
