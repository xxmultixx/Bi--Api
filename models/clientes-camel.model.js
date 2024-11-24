const Sequelize   = require('sequelize');
const db = require("./index");

const ClientesCamel = db.define('clientes_came' , {
    producto : {
        type : Sequelize.STRING(250)
    },
    sbdir : {
        type : Sequelize.STRING(250)
    },
    zona : {
        type : Sequelize.STRING(250)
    },
    nombre_zona : {
        type : Sequelize.STRING(250)
    },
    suc : {
        type : Sequelize.STRING(250)
    },
    nombre_sucursal : {
        type : Sequelize.STRING(250)
    },
    asignacion : {
        type : Sequelize.STRING(250)
    },
    nombre_despacho : {
        type : Sequelize.STRING(250)
    },
    no_ggi : {
        type : Sequelize.STRING(250)
    },
    nombre_ggi : {
        type : Sequelize.STRING(250)
    },
    ciclo_vez : {
        type : Sequelize.STRING(250)
    },
    dias_atraso : {
        type : Sequelize.STRING(50)
    },
    cartera_vigente : {
        type : Sequelize.STRING(250)
    },
    mora_estadistica : {
        type : Sequelize.STRING(250)
    },
    ahorro_consumido : {
        type : Sequelize.STRING(250)
    },
    mora_total : {
        type : Sequelize.STRING(250)
    },
    
    id_socio : {
        type: Sequelize.STRING(500),
        primaryKey: true,
        unique: {   
            args : true ,
            msg : 'id_socio registrado'
        },
        allowNull : true
    },
    nombre_socio : {
        type : Sequelize.STRING(250)
    },
    rfc : {
        type : Sequelize.STRING(250)
    },
    referencia_banamex : {
        type : Sequelize.STRING(250)
    },
    referencia_bbva : {
        type : Sequelize.STRING(250)
    },
    calle : {
        type : Sequelize.STRING(250)
    },
    numero_exterior : {
        type : Sequelize.STRING(250)
    },
    colonia : {
        type : Sequelize.STRING(250)
    },
    delegacion : {
        type : Sequelize.STRING(250)
    },
    estado : {
        type : Sequelize.STRING(250)
    },
    codigo_postal  : {
        type : Sequelize.STRING(250)
    },
    telefono : {
        type : Sequelize.STRING(250)
    },
    telefono2 : {
        type : Sequelize.STRING(250)
    },
    tipotel1 : {
        type : Sequelize.STRING(500)
    },
    tipotel2 : {
        type : Sequelize.STRING(500)
    },
    cargo : {
        type : Sequelize.STRING(250)
    },
    monto_credito_socio  : {
        type : Sequelize.STRING(250)
    },
    monto_credito_came : {
        type : Sequelize.STRING(250)
    },
    importe_pagare_grupal : {
        type : Sequelize.STRING(250)
    },
    fecha_credito : {
        type : Sequelize.STRING(250)
    },
    plazo : {
        type : Sequelize.STRING(250)
    },
    pagos_vencer : {
        type : Sequelize.STRING(250)
    },
    semanas_pagadas : {
        type : Sequelize.STRING(250)
    },
    fecha_ultimo_pago : {
        type : Sequelize.STRING(250)
    },
    saldo_individualizado_real : {
        type : Sequelize.STRING(250)
    },
    minimo_pagar : {
        type : Sequelize.STRING(250)
    },
    id_firma: {
        type : Sequelize.INTEGER
    },
    producto_cliente: {
        type : Sequelize.INTEGER
    },
    activo: {
        type: Sequelize.STRING(60),
        defaultValue: 1
    }
},{
    freezeTableName: true,
});

module.exports = ClientesCamel;