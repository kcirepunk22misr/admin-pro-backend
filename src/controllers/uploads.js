const { response, request } = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-image');

const fileUpload = (req = request, res = response) => {
	const tipo = req.params.tipo;
	const id = req.params.id;

	const tipoValidos = ['hospitales', 'medicos', 'usuarios'];
	if (!tipoValidos.includes(tipo)) {
		return res.status(400).json({
			ok: false,
			msg: 'No es un medico, usuario u hospital',
		});
	}

	//Validar que exista un archivo
	if (!req.files || Object.keys(req.files) === 0) {
		return res.status(400).json({
			ok: false,
			msg: 'No se selecciono ningun archivo',
		});
	}

	// Procesar la imagen...
	const file = req.files.imagen;

	const nombreCortado = file.name.split('.');
	const extensionArchivo = nombreCortado[nombreCortado.length - 1];

	const extensionesValida = ['png', 'jpg', 'jpeg', 'gif'];

	if (!extensionesValida.includes(extensionArchivo)) {
		return res.status(400).json({
			ok: false,
			msg: 'No es una extension permitida',
		});
	}

	// Generar nombre de la imagen
	const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

	// Path para guardar la imagen
	const directorio = path.resolve(
		__dirname,
		`../uploads/${tipo}/${nombreArchivo}`
	);

	file.mv(directorio, (err) => {
		if (err) {
			console.log(err);
			return res.status(500).json({
				ok: false,
				msg: 'Error al mover la imagen',
				err,
			});
		}

		actualizarImagen(tipo, id, directorio, nombreArchivo);

		return res.json({
			ok: true,
			msg: 'Archivo subido',
			nombreArchivo,
		});
	});
};

const retornarImagen = (req = request, res = response) => {
	const tipo = req.params.tipo;
	const foto = req.params.foto;

	const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

	// Imagen por defecto
	if (fs.existsSync(pathImg)) {
		res.sendFile(pathImg);
	} else {
		const pathImg = path.join(__dirname, `../uploads/no-image.jpg`);
		res.sendFile(pathImg);
	}
};

module.exports = {
	fileUpload,
	retornarImagen,
};
