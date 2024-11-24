const db = require('./index.js');
const Sequelize =  require('sequelize');

const DetallePermisos = db.define('detalle_permisos',{
	id_detalle_permiso : {
		type : Sequelize.INTEGER,
		autoIncrement : true,
		primaryKey : true
	},
	id_permiso : {
		type : Sequelize.INTEGER,
	},
	nombre_detalle_permiso : {
		type : Sequelize.STRING
	},
	path_detalle_permiso : {
		type : Sequelize.STRING
	},
	activo : {
		type : Sequelize.INTEGER,
		defaultValue : 1
	}
});

module.exports = DetallePermisos;

