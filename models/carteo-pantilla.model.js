const  { Sequelize }  = require('sequelize');
const db = require('./index');

const carteoPlantilla = db.define("carteo_plantilla", {
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: Sequelize.STRING,
    },
    plantilla: {
        type: Sequelize.TEXT,
    },
    body: {
        type: Sequelize.TEXT,
    }, 
    activo : {
        type : Sequelize.TINYINT,
        defaultValue : 1
    },
    id_firma: {
        type: Sequelize.INTEGER
    },
    img_encabezado: {
        type: Sequelize.STRING
    },
    img_pie: {
        type: Sequelize.STRING
    }
});


module.exports =  carteoPlantilla;