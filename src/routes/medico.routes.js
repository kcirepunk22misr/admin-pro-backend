const { Router } = require('express');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const {
	getMedicos,
	crearMedico,
	actualizarMedico,
	borrarMedico,
} = require('../controllers/medico');
const { check } = require('express-validator');

const router = Router();

router.get('/', getMedicos);

router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre del medico es oligatorio').not().isEmpty(),
		check('hospital', 'El hospital id debe ser valido').isMongoId(),
		validarCampos,
	],
	crearMedico
);

router.put('/', actualizarMedico);

router.delete('/', borrarMedico);

module.exports = router;
