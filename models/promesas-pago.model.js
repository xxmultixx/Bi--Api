const { DateTime } = require('luxon');
const { Sequelize } = require('sequelize');
const db = require('./index');

const PromesasPago = db.define("promesas_pago", {
    id_promesa: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_interaccion: {
        type: Sequelize.STRING,
    },
    cliente_unico: {
        type: Sequelize.STRING(500),
        allowNull: false
    },
    fecha_gestion: {
        type: Sequelize.DATE(6),
        allowNull: false,
        // get() {
        //     const rawValue = this.getDataValue('fecha_gestion');
        //     console.log({ rawValue , fecha : new Date(`${rawValue}`).toLocaleString() });
        //     return rawValue ?
        //         DateTime.fromJSDate(new Date(`${rawValue}`)).setZone('America/Mexico_city').toFormat('yyyy-MM-dd HH:mm:ss')
        //         :
        //         null;
        // },
    },
    telefono_contacto: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo_telefono: {
        type: Sequelize.STRING,
        allowNull: false
    },
    id_tipificacion: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    gestor: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fecha_promesa: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        // get() {
        //     console.log({this: this });
        //     const rawValue = this.getDataValue('fecha_promesa');
        //     return rawValue ? DateTime.fromISO(this.getDataValue("fecha_promesa")).toISODate() : null;
        // }, 
    },
    estatus: {
        type: Sequelize.STRING,
        defaultValue: "proceso"
    },
    monto: {
        type: Sequelize.DOUBLE,
    },
    comentario: {
        type: Sequelize.STRING(800),
    },
    tipo: {
        type: Sequelize.STRING,
    },
    id_firma:{
        type: Sequelize.INTEGER,
        defaultValue: "1"
    }
});


module.exports = PromesasPago;