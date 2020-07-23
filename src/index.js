require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();
app.use(cors({ origin: true, credentials: true }));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/api/usuarios', require('./routes/usuario.routes'));
app.use('/api/login', require('./routes/auth.routes'));

// Base de datos
dbConnection()
	.then(() => {
		// Server On Port
		app.listen(process.env.PORT, () => {
			console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
		});
	})
	.catch(console.log);
