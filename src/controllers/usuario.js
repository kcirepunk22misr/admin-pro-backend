const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
	const usuarios = await Usuario.find({}, 'nombre email role google');

	res.json({
		ok: true,
		usuarios,
	});
};

const crearUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const existeEmail = await Usuario.findOne({ email });

		if (existeEmail)
			return res.status(400).json({
				ok: false,
				msg: 'El correo ya esta registrado',
			});

		const usuario = new Usuario(req.body);

		// Encriptar contraseña
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();

		const token = await generarJWT(usuario._id);

		res.json({
			ok: true,
			usuario,
			message: 'Usuario Creado Exitosamente',
			token,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado...',
		});
	}
};

const actualizarUsuario = async (req, res = response) => {
	/* TODO: Validar token y comprobar si el usuario es correcto */

	const uid = req.params.id;

	try {
		const usuarioDB = await Usuario.findOne({ _id: uid });

		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe un usuario con este id',
			});
		}

		const { password, google, email, ...campos } = req.body;

		if (usuarioDB.email !== email) {
			const existeEmail = await Usuario.findOne({ email });
			if (existeEmail) {
				return res.status(400).json({
					ok: false,
					msg: 'Ya existe un usuario con ese email',
				});
			}
		}

		campos.email = email;

		const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
			new: true,
		});

		res.json({
			ok: true,
			usuario: usuarioActualizado,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado...',
		});
	}
};

const borrarUsuario = async (req, res = response) => {
	let id = req.params.id;

	try {
		const usuarioDB = await Usuario.findOne({ _id: id });

		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: 'No existe un usuario con este id',
			});
		}

		await Usuario.findByIdAndDelete(id);

		return res.json({
			ok: true,
			msg: 'Usuario eliminado',
		});
	} catch (error) {
		return res.status(500).json({
			ok: false,
			error,
		});
	}
};

module.exports = {
	getUsuarios,
	crearUsuario,
	actualizarUsuario,
	borrarUsuario,
};
