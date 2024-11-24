const  { Sequelize }  = require('sequelize');
const db = require('./index');


const Permisos_section = db.define("permisos_section", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_permiso: {
        type: Sequelize.INTEGER,
    },
    nombre_section: {
        type: Sequelize.STRING(60),
        allowNull : false
    },
    path_section: {
        type: Sequelize.STRING(60),
        defaultValue: 1
    },
    menu_visible : {
        type: Sequelize.INTEGER,
        defaultValue: 1
    }
});


module.exports =  Permisos_section;