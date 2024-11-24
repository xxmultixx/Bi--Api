const {Sequelize} = require('sequelize');
const db = require('./index');

const ConvenioPago = db.define("conveniopago", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_convenio: {
        type: Sequelize.INTEGER
    },
    num_pago : {
        type: Sequelize.INTEGER
    },
    fecha: {
        type: Sequelize.DATEONLY
    },
    monto: {
        type: Sequelize.STRING,
    },
    monto_real: {
        type: Sequelize.STRING,
    },
    comprobante: {
        type: Sequelize.STRING,
    },
    estatus: {
        type: Sequelize.STRING,
        defaultValue: "proceso" // proceso | completo
    }
});


module.exports = ConvenioPago;