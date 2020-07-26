const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario');
const { googleVerify } = require('../helpers/google-verify');
const { findOne } = require('../models/Usuario');

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

const googleSignIn = async (req, res) => {
	const googleToken = req.body.token;
	try {
		const { name, email, picture } = await googleVerify(googleToken);
		const usuarioDB = await Usuario.findOne({ email });
		let usuario;

		if (!usuarioDB) {
			// Si no existe el usuario
			usuario = new Usuario({
				nombre: name,
				email,
				password: '@@@',
				img: picture,
				google: true,
			});
		} else {
			// Existe usuario
			usuario = usuarioDB;
			usuario.password = '@@@';
		}

		// Guardar en DB
		await usuario.save();

		// Generar el token - jwt
		const token = await generarJWT(usuario._id);

		res.json({
			ok: true,
			token,
		});
	} catch (error) {
		res.status(401).json({
			ok: false,
			msg: 'Token no es valido',
		});
	}
};

module.exports = {
	login,
	googleSignIn,
};
