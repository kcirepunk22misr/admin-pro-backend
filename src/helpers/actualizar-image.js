const fs = require('fs');
const path = require('path');
const Hospital = require('../models/Hospital');
const Usuario = require('../models/Usuario');
const Medico = require('../models/Medico');

const borrarImagen = (path) => {
	if (fs.existsSync(path)) {
		// borrar la imagen
		fs.unlinkSync(path);
	}
};

const actualizarImagen = async (tipo, id, directorio, nombreArchivo) => {
	let directorioViejo = '';
	switch (tipo) {
		case 'medicos':
			const medico = await Medico.findById(id);
			if (!medico) {
				console.log('No es un medico por id');
				return false;
			}

			directorioViejo = path.resolve(
				__dirname,
				`../uploads/medicos/${medico.img}`
			);
			borrarImagen(directorioViejo);

			medico.img = nombreArchivo;
			await medico.save();
			return true;

		case 'hospitales':
			const hospital = await Hospital.findById(id);
			if (!hospital) {
				console.log('No es un hospital por id');
				return false;
			}

			directorioViejo = path.resolve(
				__dirname,
				`../uploads/hospitales/${hospital.img}`
			);
			borrarImagen(directorioViejo);

			hospital.img = nombreArchivo;
			await hospital.save();
			return true;
		case 'usuarios':
			const usuario = await Usuario.findById(id);
			if (!usuario) {
				console.log('No es un usuario por id');
				return false;
			}

			directorioViejo = path.resolve(
				__dirname,
				`../uploads/usuarios/${usuario.img}`
			);
			borrarImagen(directorioViejo);

			usuario.img = nombreArchivo;
			await usuario.save();
			return true;
		default:
			break;
	}
};

module.exports = {
	actualizarImagen,
};
