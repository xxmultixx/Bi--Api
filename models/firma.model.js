const  { Sequelize }  = require('sequelize');
const db = require('./index');

const Firma = db.define("firmas", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: Sequelize.STRING,
    },
    activo : {
        type : Sequelize.TINYINT,
        defaultValue : 1
    }
});


module.exports =  Firma;