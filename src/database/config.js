const mongoose = require('mongoose');

const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.DB_CNN, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('Database Is Connected');
	} catch (error) {
		console.log(error);
		throw new Error('Erorr a la hora de iniciar la base de datos');
	}
};

module.exports = {
	dbConnection,
};
