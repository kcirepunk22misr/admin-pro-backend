const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario');

const login = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		// Verificar email
		const usuarioDB = await Usuario.findOne({ email });

		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: 'Email no valida',
			});
		}

		// Verificar contraseña
		const validPassword = bcrypt.compareSync(password, usuarioDB.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Contraseña no válida',
			});
		}

		// Generar el token - jwt
		const token = await generarJWT(usuarioDB._id);

		res.json({
			ok: true,
			token,
		});
	} catch (err) {
		res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador',
		});
	}
};

module.exports = {
	login,
};
