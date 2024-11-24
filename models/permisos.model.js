const  { Sequelize }  = require('sequelize');
const db = require('./index');


const Permisos = db.define("permisos", {
    id_permiso: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: Sequelize.STRING(60),
        allowNull : false
    },
    path: {
        type: Sequelize.STRING(60),
        defaultValue: 1
    },
    menu_visible : {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    activo : {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    orden : {
        type: Sequelize.INTEGER,
    }
});


module.exports =  Permisos;