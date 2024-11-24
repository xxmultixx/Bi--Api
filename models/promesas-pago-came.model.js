const { Sequelize } = require('sequelize');
const db = require('./index');

const PromesasPagoCame = db.define("promesas_pago_came", {
    id_promesa: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_interaccion: {
        type: Sequelize.STRING,
    },
    id_socio: {
        type: Sequelize.STRING(500),
        allowNull: false
    },
    fecha_gestion: {
        type: Sequelize.DATE(6),
        allowNull: false,
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
    }
});


module.exports = PromesasPagoCame;