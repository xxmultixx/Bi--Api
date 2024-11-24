const { Sequelize } = require('sequelize');
const db = require('./index');


const ConveniosBancoAzteca = db.define("convenios_banco_azteca", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cliente_unico: {
        type: Sequelize.STRING(500)
    },
    gestor: {
        type: Sequelize.STRING,
    },
    id_tipificacion : {
        type : Sequelize.INTEGER
    },
    telefono: {
        type: Sequelize.STRING,
    },
    monto: {
        type: Sequelize.STRING,
    },
    pagos_realizar: {
        type: Sequelize.INTEGER,
    },
    tipo_credito: {
        type: Sequelize.STRING,
    },
    comentario: {
        type: Sequelize.STRING,
    },
    estatus: {
        type: Sequelize.STRING,
        defaultValue: "proceso"
    },
});


module.exports =  ConveniosBancoAzteca;