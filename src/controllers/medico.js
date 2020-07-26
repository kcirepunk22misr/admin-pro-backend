const { response } = require('express');
const Medico = require('../models/Medico');

const getMedicos = async (req, res = response) => {
	const medicos = await Medico.find()
		.populate('usuario', 'nombre img')
		.populate('hospital');

	res.json({
		ok: true,
		medicos,
	});
};

const crearMedico = async (req, res = response) => {
	const uid = req.uid;
	const medico = new Medico({
		usuario: uid,
		...req.body,
	});

	try {
		const medicoDB = await medico.save();

		res.json({
			ok: true,
			medico: medicoDB,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: 'Hable con el administrador',
		});
	}
};

const actualizarMedico = (req, res = response) => {
	res.json({
		ok: true,
		msg: 'crearHospital',
	});
};

const borrarMedico = (req, res = response) => {
	res.json({
		ok: true,
		msg: 'borrarHospital',
	});
};

module.exports = {
	getMedicos,
	crearMedico,
	actualizarMedico,
	borrarMedico,
};
