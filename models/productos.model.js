const Sequelize = require('sequelize');
const db = require('./index');

const Productos = db.define('productos',{
    id_producto : {
        type : Sequelize.INTEGER,
        primaryKey : true ,
        autoIncrement : true,
    },
    id_firma : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    nombre_producto : {
        type : Sequelize.STRING,
        allowNull : false ,
    },
    activo : {
        type : Sequelize.TINYINT,
        defaultValue : 1 ,
    }
});

module.exports = Productos;