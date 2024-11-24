const  { Sequelize }  = require('sequelize');
const db = require('./index');


const InteracionesCame = db.define("interaciones_came", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_interaccion: {
        type: Sequelize.STRING,
    },
    id_socio: {
        type: Sequelize.STRING(500),
        allowNull : false
    },
    fecha_gestion: {
        type: Sequelize.DATE,
        allowNull : false
    },
    telefono_contacto :{
        type: Sequelize.STRING,
        allowNull : false
    },
    tipo_telefono : {
        type: Sequelize.STRING,
        allowNull : false
    },
    id_tipificacion: {
        type: Sequelize.INTEGER,
        allowNull : false
    },
    gestor : {
        type: Sequelize.STRING,
        allowNull : false
    },
    comentario : {
        type: Sequelize.STRING,
    },
    ani : {
        type: Sequelize.STRING,
    },
    id_tarea : {
        type: Sequelize.STRING,
    },
    tipo : {
        type: Sequelize.STRING(10),
    }
},{
    freezeTableName: true,
});


module.exports =  InteracionesCame;