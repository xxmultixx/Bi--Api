const db = require("./index");
const  Sequelize   = require('sequelize');

const clientesApoyoEconomico = db.define('clientes_apoyo_economico',{
    operacionesid : {
        type : Sequelize.STRING(500),
        primaryKey: true,
        unique: {   
            args : true ,
            msg : 'operacionesid registrado'
        },
        allowNull : true
    },
    clientes_id : {
        type: Sequelize.STRING(500),
    },
    despacho : {
        type : Sequelize.STRING(250)
    },
    fecha_inic : {
        type : Sequelize.STRING(250)
    },
    fecha_fin : {
        type : Sequelize.STRING(250)
    },
    suc : {
        type : Sequelize.STRING(250)
    },
    sucursal : {
        type : Sequelize.STRING(250)
    },
    cta : {
        type : Sequelize.STRING(250)
    },
    nombre_cte : {
        type : Sequelize.STRING(250)
    },
    capinsoluto : {
        type : Sequelize.STRING(250)
    },
    capvencido : {
        type : Sequelize.STRING(250)
    },
    diassinmov : {
        type : Sequelize.STRING(250)
    },
    dias_vencidos : {
        type : Sequelize.STRING(250)
    },
    bucket : {
        type : Sequelize.STRING(250)
    },
    gasto_cob : {
        type : Sequelize.STRING(250)
    },
    iva_gasto_cob : {
        type : Sequelize.STRING(250)
    },
    cap_contable : {
        type : Sequelize.STRING(250)
    },
    moratorios : {
        type : Sequelize.STRING(250)
    },
    inters_ord : {
        type : Sequelize.STRING(250)
    },
    iva_intord : {
        type : Sequelize.STRING(250)
    },
    iva_intmora : {
        type : Sequelize.STRING(250)
    },
    total_adedo : {
        type : Sequelize.STRING(250)
    },
    mtoven : {
        type : Sequelize.STRING(250)
    },
    monto_ultcob : {
        type : Sequelize.STRING(250)
    },
    fecha_operacion : {
        type : Sequelize.STRING(250)
    },
    payoff : {
        type : Sequelize.STRING(250)
    },
    monto_colocado : {
        type : Sequelize.STRING(250)
    },
    producto : {
        type : Sequelize.STRING(250)
    },
    tipo_credito : {
        type : Sequelize.STRING(250)
    },
    plazo_pago : {
        type : Sequelize.STRING(250)
    },
    preriodo : {
        type : Sequelize.STRING(250)
    },
    per_max_pagado : {
        type : Sequelize.STRING(250)
    },
    monto : {
        type : Sequelize.STRING(250)
    },
    imp_extension : {
        type : Sequelize.STRING(250)
    },
    fec_extension : {
        type : Sequelize.STRING(250)
    },
    plazo_pago_total : {
        type : Sequelize.STRING(250)
    },
    fecha_traspaso_esp : {
        type : Sequelize.STRING(250)
    },
    fecha_traspaso_rec : {
        type : Sequelize.STRING(250)
    },
    dir : {
        type : Sequelize.STRING(500)
    },
    exterior : {
        type : Sequelize.STRING(250)
    },
    interior : {
        type : Sequelize.STRING(250)
    },
    colonia : {
        type : Sequelize.STRING(250)
    },
    estado : {
        type : Sequelize.STRING(250)
    },
    municipio : {
        type : Sequelize.STRING(250)
    },
    cp : {
        type : Sequelize.STRING(250)
    },
    entre_calles : {
        type : Sequelize.STRING(500)
    },
    tel1 : {
        type : Sequelize.STRING(250)
    },
    tel2 : {
        type : Sequelize.STRING(250)
    },
    cel : {
        type : Sequelize.STRING(250)
    },
    telcel : {
        type : Sequelize.STRING(250)
    },
    compania : {
        type : Sequelize.STRING(250)
    },
    dir_trabajo : {
        type : Sequelize.STRING(250)
    },
    puesto : {
        type : Sequelize.STRING(250)
    },
    jefe : {
        type : Sequelize.STRING(250)
    },
    tel1_trabajo : {
        type : Sequelize.STRING(250)
    },
    tel2_trabajo : {
        type : Sequelize.STRING(250)
    },
    ext_trabajo : {
        type : Sequelize.STRING(250)
    },
    razon_social_a : {
        type : Sequelize.STRING(250)
    },
    parentesco_a : {
        type : Sequelize.STRING(250)
    },
    direccion_a : {
        type : Sequelize.STRING(250)
    },
    exterior_a : {
        type : Sequelize.STRING(250)
    },
    interior : {
        type : Sequelize.STRING(250)
    },
    colonia : {
        type : Sequelize.STRING(250)
    },
    municipio : {
        type : Sequelize.STRING(250)
    },
    estado_a : {
        type : Sequelize.STRING(250)
    },
    cp_a : {
        type : Sequelize.STRING(250)
    },
    entre_calles_a : {
        type : Sequelize.STRING(250)
    },
    tel1_a : {
        type : Sequelize.STRING(250)
    },
    tel2_a : {
        type : Sequelize.STRING(250)
    },
    telcel_a : {
        type : Sequelize.STRING(250)
    },
    compania_a : {
        type : Sequelize.STRING(250)
    },
    dir_trabajo_a : {
        type : Sequelize.STRING(250)
    },
    puesto_a : {
        type : Sequelize.STRING(250)
    },
    puesto_a : {
        type : Sequelize.STRING(250)
    },
    jefe_a : {
        type : Sequelize.STRING(250)
    },
    tel1_trabajo_a : {
        type : Sequelize.STRING(250)
    },
    tel2_trabajo_a : {
        type : Sequelize.STRING(250)
    },
    ext_trabajo_a : {
        type : Sequelize.STRING(250)
    },
    razon_social_c : {
        type : Sequelize.STRING(250)
    },
    parentesco_c : {
        type : Sequelize.STRING(250)
    },
    direccion_c : {
        type : Sequelize.STRING(250)
    },
    exterior_c : {
        type : Sequelize.STRING(250)
    },
    interior_c : {
        type : Sequelize.STRING(250)
    },
    colonia_c : {
        type : Sequelize.STRING(250)
    },
    municipio_c : {
        type : Sequelize.STRING(250)
    },
    estado_c : {
        type : Sequelize.STRING(250)
    },
    cp_c : {
        type : Sequelize.STRING(250)
    },
    entre_calles_c : {
        type : Sequelize.STRING(250)
    },
    te1_c : {
        type : Sequelize.STRING(250)
    },
    tel2_c : {
        type : Sequelize.STRING(250)
    },
    telcel_c : {
        type : Sequelize.STRING(250)
    },
    compania_c : {
        type : Sequelize.STRING(250)
    },
    dir_trabajo_c : {
        type : Sequelize.STRING(250)
    },
    puesto_c : {
        type : Sequelize.STRING(250)
    },
    jefe_c : {
        type : Sequelize.STRING(250)
    },
    te1_trabajo_c : {
        type : Sequelize.STRING(250)
    },
    tel2_trabajo_c : {
        type : Sequelize.STRING(250)
    },
    ext_trabajo_c : {
        type : Sequelize.STRING(250)
    },
    nombre_ref_1 : {
        type : Sequelize.STRING(250)
    },
    telefono_ref_1 : {
        type : Sequelize.STRING(250)
    },
    domicilio_ref_1 : {
        type : Sequelize.STRING(250)
    },
    parentesco_ref_1 : {
        type : Sequelize.STRING(250)
    },
    nombre_ref_2 : {
        type : Sequelize.STRING(250)
    },
    telefono_ref_2 : {
        type : Sequelize.STRING(250)
    },
    domicilio_ref_2 : {
        type : Sequelize.STRING(250)
    },
    parentesco_ref_2 : {
        type : Sequelize.STRING(250)
    },
    nombre_ref_3  : {
        type : Sequelize.STRING(250)
    },
    telefono_ref_3 : {
        type : Sequelize.STRING(250)
    },
    domicilio_ref_3 : {
        type : Sequelize.STRING(250)
    },
    parentesco_ref_3 : {
        type : Sequelize.STRING(250)
    },
    nombre_ref_4 : {
        type : Sequelize.STRING(250)
    },
    telefono_ref_4 : {
        type : Sequelize.STRING(250)
    },
    domicilio_ref_4 : {
        type : Sequelize.STRING(250)
    },
    parentesco_ref_4 : {
        type : Sequelize.STRING(250)
    },
    nombre_ref_5 : {
        type : Sequelize.STRING(250)
    },
    telefono_ref_5 : {
        type : Sequelize.STRING(250)
    },
    domicilio_ref_5 : {
        type : Sequelize.STRING(250)
    },
    parentesco_ref_5 : {
        type : Sequelize.STRING(250)
    },
    rfc : {
        type : Sequelize.STRING(250)
    },
    rfc_a : {
        type : Sequelize.STRING(250)
    },
    rfc_c : {
        type : Sequelize.STRING(250)
    },
    num_pag_rea : {
        type : Sequelize.STRING(250)
    },
    pag_mensual : {
        type : Sequelize.STRING(250)
    },
    id_layout: {
        type : Sequelize.STRING(250),  
    },
    referencia : {
        type : Sequelize.STRING(250)
    },
    id_firma: {
        type : Sequelize.INTEGER,
        
    },
    producto_cliente: {
        type : Sequelize.INTEGER
    },
    activo: {
        type: Sequelize.STRING(60),
        defaultValue: 1
    },
    tipotel1 : {
        type : Sequelize.STRING(500)
    },
    tipotel2 : {
        type : Sequelize.STRING(500)
    },
    tipotel3: {
        type : Sequelize.STRING(500)
    }
},{
    freezeTableName: true,
});

module.exports = clientesApoyoEconomico;