/**
 *  RUTA: /api/usuarios
 */
const { Router } = require('express');
const { check } = require('express-validator');
const {
	getUsuarios,
	crearUsuario,
	actualizarUsuario,
	borrarUsuario,
} = require('../controllers/usuario');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJWT], getUsuarios);

router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('password', 'La contraseña es obligatorio').not().isEmpty(),
		check('email', 'Verifica que sea un email valido').isEmail(),
		validarCampos,
	],
	crearUsuario
);

router.put(
	'/:id',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('email', 'El email es obligatorio').isEmail(),
		check('role', 'El role es obligatorio').not().isEmpty(),
		validarCampos,
	],
	actualizarUsuario
);

router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;
