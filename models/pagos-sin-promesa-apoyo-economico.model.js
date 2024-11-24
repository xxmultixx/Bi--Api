const  { Sequelize }  = require('sequelize');
const db = require('./index');

const PagosSinPromesaApoyoEconomico = db.define("pagosSinPromesa_apoyo_economico", {
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_interaccion: {
        type: Sequelize.STRING,
    },
    operacionesid: {
        type: Sequelize.STRING(500),
        allowNull : false
    },
    fecha_gestion: {
        type: Sequelize.DATE(6),
        allowNull : false
    },
    gestor : {
        type: Sequelize.STRING,
        allowNull : false
    },
    fecha_pago : {
        type: Sequelize.DATEONLY,
        allowNull : false
    },
    tipo_pago : {
        type: Sequelize.STRING,
        allowNull : false
    },
    id_promesa: {
        type: Sequelize.INTEGER
    },
    // hace referencia si fue con titular, tercero, o aval
    tipo_contacto:{
        type: Sequelize.STRING,
    },
    monto : {
        type: Sequelize.DOUBLE,
        allowNull : false
    },
    comentario : {
        type: Sequelize.STRING(800),
    },
    tipo : {
        type: Sequelize.STRING(10),
    },
    telefono_contacto : {
        type: Sequelize.STRING(800),
    },
},{
    freezeTableName: true,
});


module.exports =  PagosSinPromesaApoyoEconomico;