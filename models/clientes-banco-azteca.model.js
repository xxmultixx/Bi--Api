const   Sequelize   = require('sequelize');
const db = require('./index');


const ClientesBancoAzteca = db.define("clientes_banco_azteca", {
    cliente_unico: {
        type: Sequelize.STRING(500),
        primaryKey: true,
        unique: {   
            args : true ,
            msg : 'Cliente unico registrado'
        },
        allowNull : true
    },
    nombre_cte : {
        type: Sequelize.STRING(500),
    },
    genero_cliente: {
        type: Sequelize.STRING(500),
    },
    edad_cliente: {
        type : Sequelize.STRING(500)
    },
    ocupacion : {
        type : Sequelize.STRING(500)
    },
    direccion_cte : {
        type : Sequelize.STRING(500)
    },
    num_ext_cte : {
        type : Sequelize.STRING(500)
    },
    num_int_cte : {
        type : Sequelize.STRING(500)
    },
    cp_cte : {
        type : Sequelize.STRING(500)
    },
    colonia_cte : {
        type : Sequelize.STRING(500)
    },
    poblacion_cte : {
        type : Sequelize.STRING(500)
    },
    estado_cte : {
        type : Sequelize.STRING(500)
    },
    territorio: {
        type : Sequelize.STRING(500)
    },
    gerencia: {
        type : Sequelize.STRING(500)
    },
    referencias_domicilio: {
        type : Sequelize.STRING(500)
    },
    clasificacion_cte: {
        type : Sequelize.STRING(500)
    },
    atraso_maximo: {
        type : Sequelize.STRING(500)
    },
    dias_atraso: {
        type : Sequelize.STRING(500)
    },
    saldo: {
        type : Sequelize.STRING(500)
    },
    moratorios: {
        type : Sequelize.STRING(500)
    },
    saldo_total: {
        type : Sequelize.STRING(500)
    },
    saldo_atrasado: {
        type : Sequelize.STRING(500)
    },
    saldo_requerido: {
        type :Sequelize.STRING(500)
    },
    pago_normal: {
        type : Sequelize.STRING(500)
    },
    producto:{
        type : Sequelize.STRING(500)
    },
    fecha_ultimo_pago: {
        type : Sequelize.STRING(500)                        
    },
    imp_ultimo_pago: {
        type : Sequelize.STRING(500)
    },
    calle_empleo : {
        type : Sequelize.STRING(500)
    },
    num_ext_empleo: {
        type : Sequelize.STRING(500)
    },
    num_int_empleo: {
        type : Sequelize.STRING(500)
    },
    colonia_empleo : {
        type : Sequelize.STRING(500)
    },
    poblacion_empleo : {
        type : Sequelize.STRING(500)
    },
    estado_empleo: {
        type : Sequelize.STRING(500)
    },
    nombre_aval : {
        type : Sequelize.STRING(500)
    },
    tel_aval : {
        type : Sequelize.STRING(500)
    },
    calle_aval : {
        type : Sequelize.STRING(500)
    },
    num_ext_aval : {
        type : Sequelize.STRING(500)
    },
    colonia_aval : {
        type : Sequelize.STRING(500)
    },
    cp_aval : {
        type : Sequelize.STRING(500)
    },
    poblacion_aval  : {
        type : Sequelize.STRING(500)
    },
    estado_aval : {
        type : Sequelize.STRING(500)
    }, 
    fidiapago : {
        type : Sequelize.STRING(500)
    },
    
    telefono1 : {
        type : Sequelize.STRING(500)
    },
    telefono2 : {
        type : Sequelize.STRING(500)
    },
    telefono3 : {
        type : Sequelize.STRING(500)
    },
    telefono4 : {
        type : Sequelize.STRING(500)
    },
    tipotel1 : {
        type : Sequelize.STRING(500)
    },
    tipotel2 : {
        type : Sequelize.STRING(500)
    },
    tipotel3 : {
        type : Sequelize.STRING(500)
    },
    tipotel4 : {
        type : Sequelize.STRING(500)
    },
   
    latitud : {
        type : Sequelize.STRING(500)
    },
    longitud : {
        type : Sequelize.STRING(500)
    },
    despacho_gestiono : {
        type : Sequelize.STRING(500)
    },
    ultima_gestion : {
        type : Sequelize.STRING(500)
    },
    gestion_desc : {
        type : Sequelize.STRING(500)
    },
    campania_relampago : {
        type : Sequelize.STRING(500)
    },
    campania : {
        type : Sequelize.STRING(500)
    },
    tipo_cartera : {
        type : Sequelize.STRING(500)
    },
    id_grupo : {
        type : Sequelize.STRING(500)
    },
    grupo_maz : {
        type : Sequelize.STRING(500)
    },
    clave_spei : {
        type : Sequelize.STRING(50)
    },
    pagos_cliente : {
        type : Sequelize.STRING(500)
    },
    monto_pagos : {
        type : Sequelize.STRING(500)
    },
    estatus_plan : {
        type : Sequelize.STRING(500)
    },
    generacion_plan : {
        type : Sequelize.STRING(500)
    },
    cancelacion_cumplimiento_plan : {
        type : Sequelize.STRING(500)
    },
    abono_semanal : {
        type : Sequelize.STRING(500)
    },
    plazo : {
        type : Sequelize.STRING(500)
    },
    monto_abonado : {
        type : Sequelize.STRING(500)
    },
    monto_plan : {
        type : Sequelize.STRING(500)
    },
  
    
    estatus_promesa_pago : {
        type : Sequelize.STRING(500)
    },
    monto_promesa_pago : {
        type : Sequelize.STRING(500)
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
    },
    territorial: {
        type : Sequelize.STRING(500)
    },
    zona: {
        type : Sequelize.STRING(500)
    },
    zonal: {
        type : Sequelize.STRING(500)
    },
    nombre_despacho: {
        type : Sequelize.STRING(500)
    },
    
    segmento: {
        type : Sequelize.STRING(500)
    },

},{
    freezeTableName: true,
});


module.exports =  ClientesBancoAzteca;

