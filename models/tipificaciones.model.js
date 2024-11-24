const  { Sequelize }  = require('sequelize');
const db = require('./index');


const Tipificaciones = db.define("tipificaciones", {
    id_tipificacion: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    //si es para gestion, promesa de pago o reporte de pago
    tipo : {
        type: Sequelize.STRING,
    },
    codigo_accion_siglas:{
        type: Sequelize.STRING,
    },
    codigo_accion: {
        type: Sequelize.STRING,
        allowNull : false
    },
    codigo_resultado: {
        type: Sequelize.STRING,
        allowNull : false
    },
    codigo_resultado_siglas: {
        type: Sequelize.STRING,
        allowNull : false
    },
    activo: {
        type: Sequelize.TINYINT,
        defaultValue: 1
    },
    id_firma :{
        type: Sequelize.TINYINT
    },
    accion :{
        type: Sequelize.STRING
    },
});


module.exports =  Tipificaciones;