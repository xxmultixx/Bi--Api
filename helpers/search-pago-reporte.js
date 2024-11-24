const { Op, fn, col, literal, where } = require('sequelize');
const clientesApoyoEconomico = require('../models/clientes-apoyo-economico.model');
const ClientesBancoAzteca = require('../models/clientes-banco-azteca.model');
const ClientesCamel = require('../models/clientes-camel.model');
const PagosApoyoEconomico = require('../models/pagos-apoyo-economico.model');
const PagosCame = require('../models/pagos-came.model');
const Pagos = require('../models/pagos.model');
const Productos = require('../models/productos.model');


const getPagosClientesBancoAzteca = async ({ fecha_inicio, fecha_limite, producto }) => {

    // Este objeto tiene la config de la consulta que filtra los pagos.
    const rulesFind = {
        include: [
            {
                model: Pagos,
                attributes: [],
                where: where(fn('format', col('fecha_pago'), 'yyyy-MM-dd'), {
                    [Op.between]: [fecha_inicio, fecha_limite]
                }),

            },
            {
                model: Productos,
                attributes: [],
                as: 'producto_banco_azteca',
            }
        ],
        attributes: [

            //TODO:: Columnas que quiero de la tabla de clientes
            ['cliente_unico', 'id_cliente'],
            ['nombre_cte', 'nombre_cliente'],
            
            //TODO:: Columnas que quiero de la tabla de pagos
            [literal('"pagos"."gestor"'), "gestor"],
            [literal('"pagos"."tipo_contacto"'), "tipo_contacto"],
            [literal('"pagos"."monto"'), "monto"],
            [literal('"pagos"."gestor"'), "gestor"],
            [fn('replace', col('tipo_pago'), 'Liquidación', 'Liquidacion'), "tipo_pago"],
            [fn('format', col("fecha_gestion"), 'yyyy-MM-dd'), 'fecha_gestion'],
            [fn('format', col("fecha_pago"), 'yyyy-MM-dd'), 'fecha_pago'],

            //TODO:: Columnas que quiero productos
            [literal('"producto_banco_azteca"."nombre_producto"'), "nombre_producto"],

            //TODO:: Columnas fake ó falsas
            [literal("'banco_azteca'"), 'firma'],
            'gerencia',
        ],
        raw: true,
        order: [[literal('"pagos"."fecha_gestion"'), 'asc']],

    }

    // Este objeto contine la config que clasifica los pagos.
    const rulesCount = {
        include: [
            {
                model: Pagos,
                attributes: [],
                where: where(fn('format', col('fecha_pago'), 'yyyy-MM-dd'), {
                    [Op.between]: [fecha_inicio, fecha_limite]
                }),
            }
        ],
        attributes: [
            [fn('count', col("*")), 'total_pagos'],
            [literal("'banco_azteca'"), 'firma'],
            [fn('replace', col('tipo_pago'), 'Liquidación', 'Liquidacion'), "tipo_pago"],
            [fn('sum', col("monto")), 'suma_pagos']

        ],
        group: ['tipo_pago'],
        raw: true
    }


    if (producto != '') {
        rulesFind.where = { producto_cliente: producto }
        rulesCount.where = { producto_cliente: producto }
    }

    const querys = [
        ClientesBancoAzteca.findAll(rulesCount),
        ClientesBancoAzteca.findAll(rulesFind)
    ];

    try {

        const data = await Promise.all(querys);
        return data;

    } catch (error) {

        console.log(error);
        throw 'Hubo un error al momento de buscar los pagos para los reportes';
    }

}

const getPagosClientesCame = async ({ fecha_inicio, fecha_limite, producto }) => {


    // Este objeto tiene la config de la consulta que filtra los pagos.
    const rulesFind = {
        include: [
            {
                model: PagosCame,
                attributes: [],
                where: where(fn('format', col('fecha_pago'), 'yyyy-MM-dd'), {
                    [Op.between]: [fecha_inicio, fecha_limite]
                }),
            },
            {
                model: Productos,
                attributes: [],
                as: 'producto_came',
            }
        ],
        attributes: [

            //TODO:: Columnas que quiero de la tabla de clientes
            ['id_socio', 'id_cliente'],
            ['nombre_socio', 'nombre_cliente'],

            // //TODO:: Columnas que quiero de la tabla de pagos
            [literal('"pagos_cames"."gestor"'), "gestor"],
            [literal('"pagos_cames"."tipo_contacto"'), "tipo_contacto"],
            [literal('"pagos_cames"."monto"'), "monto"],
            [literal('"pagos_cames"."gestor"'), "gestor"],
            [fn('replace', col('tipo_pago'), 'Liquidación', 'Liquidacion'), "tipo_pago"],
            [fn('format', col("fecha_gestion"), 'yyyy-MM-dd'), 'fecha_gestion'],
            [fn('format', col("fecha_pago"), 'yyyy-MM-dd'), 'fecha_pago'],

            // //TODO:: Columnas que quiero productos
            [literal('"producto_came"."nombre_producto"'), "nombre_producto"],

            // //TODO:: Columnas fake ó falsas
            [literal("'came'"), 'firma']
        ],
        raw: true,
        order: [[literal('"pagos_cames"."fecha_gestion"'), 'asc']],
    }

    // Este objeto contine la config que clasifica los pagos.
    const rulesCount = {
        include: [
            {
                model: PagosCame,
                attributes: [],
                where: where(fn('format', col('fecha_pago'), 'yyyy-MM-dd'), {
                    [Op.between]: [fecha_inicio, fecha_limite]
                }),
            }
        ],
        attributes: [
            [fn('count', col("*")), 'total_pagos'],
            [literal("'came'"), 'firma'],
            [fn('replace', col('tipo_pago'), 'Liquidación', 'Liquidacion'), "tipo_pago"],
            [fn('sum', col("monto")), 'suma_pagos']

        ],
        group: ['tipo_pago'],
        raw: true
    }


    if (producto != '') {
        rulesFind.where = { producto_cliente: producto }
        rulesCount.where = { producto_cliente: producto }
    }

    const querys = [
        ClientesCamel.findAll(rulesCount),
        ClientesCamel.findAll(rulesFind)
    ];

    try {

        const data = await Promise.all(querys);
        return data;

    } catch (error) {

        console.log(error);
        throw 'Hubo un error al momento de buscar los pagos para los reportes';
    }

}


const getPagosClientesApoyo = async ({ fecha_inicio, fecha_limite, producto }) => {


    // Este objeto tiene la config de la consulta que filtra los pagos.
    const rulesFind = {
        include: [
            {
                model: PagosApoyoEconomico,
                attributes: [],
                where: where(fn('format', col('fecha_pago'), 'yyyy-MM-dd'), {
                    [Op.between]: [fecha_inicio, fecha_limite]
                }),
            },
            {
                model: Productos,
                attributes: [],
                as: 'producto_apoyo_economico',
            }
        ],
        attributes: [

            //TODO:: Columnas que quiero de la tabla de clientes
            ['operacionesid', 'id_cliente'],
            ['nombre_cte', 'nombre_cliente'],

            // //TODO:: Columnas que quiero de la tabla de pagos
            [literal('"pagos_apoyo_economicos"."gestor"'), "gestor"],
            [literal('"pagos_apoyo_economicos"."tipo_contacto"'), "tipo_contacto"],
            [literal('"pagos_apoyo_economicos"."monto"'), "monto"],
            [literal('"pagos_apoyo_economicos"."gestor"'), "gestor"],
            [fn('replace', col('tipo_pago'), 'Liquidación', 'Liquidacion'), "tipo_pago"],
            [fn('format', col("fecha_gestion"), 'yyyy-MM-dd'), 'fecha_gestion'],
            [fn('format', col("fecha_pago"), 'yyyy-MM-dd'), 'fecha_pago'],

            // //TODO:: Columnas que quiero productos
            [literal('"producto_apoyo_economico"."nombre_producto"'), "nombre_producto"],

            // //TODO:: Columnas fake ó falsas
            [literal("'apoyo economico'"), 'firma']
        ],
        raw: true,
        order: [[literal('"pagos_apoyo_economicos"."fecha_gestion"'), 'asc']],
    }

    // Este objeto contine la config que clasifica los pagos.
    const rulesCount = {
        include: [
            {
                model: PagosApoyoEconomico,
                attributes: [],
                where: where(fn('format', col('fecha_pago'), 'yyyy-MM-dd'), {
                    [Op.between]: [fecha_inicio, fecha_limite]
                }),
            }
        ],
        attributes: [
            [fn('count', col("*")), 'total_pagos'],
            [literal("'came'"), 'firma'],
            [fn('replace', col('tipo_pago'), 'Liquidación', 'Liquidacion'), "tipo_pago"],
            [fn('sum', literal('"pagos_apoyo_economicos"."monto"')), 'suma_pagos']
        ],

        group: ['tipo_pago'],
        raw: true
    }


    if (producto != '') {
        rulesFind.where = { producto_cliente: producto }
        rulesCount.where = { producto_cliente: producto }
    }

    const querys = [
        clientesApoyoEconomico.findAll(rulesCount),
        clientesApoyoEconomico.findAll(rulesFind)
    ];

    try {

        const data = await Promise.all(querys);
        return data;

    } catch (error) {

        console.log(error);
        throw 'Hubo un error al momento de buscar los pagos para los reportes';
    }

}


module.exports = {
    getPagosClientesBancoAzteca,
    getPagosClientesCame,
    getPagosClientesApoyo

}