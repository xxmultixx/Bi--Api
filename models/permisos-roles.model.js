const  { Sequelize }  = require('sequelize');
const db = require('./index');


const PermisosRoles = db.define("permisos_roles", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_role: {
        type: Sequelize.INTEGER,
        allowNull : false
    },
    id_permiso: {
        type: Sequelize.INTEGER,
        allowNull : false
    },
    menu_visible:{
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    activo : {
        type: Sequelize.STRING(60),
        defaultValue: 1
    }
});


module.exports =  PermisosRoles;