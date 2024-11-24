const moment = require('moment');
const { Op, fn, col, literal, where } = require('sequelize');
const clientesApoyoEconomico = require('../models/clientes-apoyo-economico.model');
const ClientesBancoAzteca = require('../models/clientes-banco-azteca.model');
const ClientesCamel = require('../models/clientes-camel.model');
const Productos = require('../models/productos.model');
const PromesasPagoApoyoEconomico = require('../models/promesas-pago-apoyo-economico.model');
const PromesasPagoCame = require('../models/promesas-pago-came.model');
const PromesasPago = require('../models/promesas-pago.model');


const getPromesasClientesBancoAztecaFilter = async ({ fecha_inicio, fecha_limite, producto, nuevas = "" }) => {

    
    let whereRule = {
        [Op.or]: [
            where(fn('format', col('fecha_promesa'), 'yyyy-MM-dd'), {
                [Op.between]: [fecha_inicio, fecha_limite]
            })
        ],
        id_promesa: {
            [Op.in] : [literal(`SELECT MAX(id_promesa) from promesas_pagos group by cliente_unico`)]
        }
    }

    if (nuevas !== '') {
        whereRule = {
            [Op.or]: [
                where(fn('format', col('fecha_promesa'), 'yyyy-MM-dd'), {
                    [Op.between]: [fecha_inicio, fecha_limite]
                })
            ],
            estatus: 'proceso',
            cliente_unico: {
                [Op.notIn]: [literal(` SELECT DISTINCT cliente_unico FROM [promesas_pagos] WHERE estatus = 'rota'`)]
            }

        }
    }

    //* Este objeto continene la configuracion de el fina
    const rulesFind = {
        include: [
            {
                model: PromesasPago,
                attributes: [],
                where: whereRule

            },
            {
                model: Productos,
                attributes: [],
                as: 'producto_banco_azteca',
            }
        ],
        attributes: [
            // Columnas Clientes
            ['cliente_unico', 'id_cliente'],
            ['nombre_cte', 'nombre_cliente'],

            // Columnas promeas-pagos
            [literal('"promesas_pagos"."id_promesa"'), "id_promesa"],
            [literal('"promesas_pagos"."gestor"'), "gestor"],
            [fn('format', literal('"promesas_pagos"."fecha_gestion"'), 'yyyy-MM-dd'), 'fecha_gestion'],
            [fn('format', literal('"promesas_pagos"."fecha_promesa"'), 'yyyy-MM-dd'), 'fecha_promesa'],
            [literal('"promesas_pagos"."monto"'), "monto"],
            [literal('"promesas_pagos"."estatus"'), "estatus"],
            [literal("'banco_azteca'"), 'firma'],

            // Columnas productos
            [literal('"producto_banco_azteca"."nombre_producto"'), "nombre_producto"],
            'gerencia'
        ],
        raw: true,
        order: [[literal('"promesas_pagos"."id_promesa"'), 'DESC']],


    }

    // Este objeto es el que se encarga de agrupar las promeas por su estatus.
    const rulesCount = {
        include: [
            {
                model: PromesasPago,
                attributes: [],
                where: whereRule  
                
            }
        ],
        attributes: [
            [fn('count', col("*")), 'total_promesa'],
            [literal("'banco azteca'"), 'firma'],
            [literal('"promesas_pagos"."estatus"'), "estatus"],
            [fn('sum', literal('"promesas_pagos"."monto"')), 'suma_promesas']
        ],
        group: ['estatus'],
        raw: true,

    }

    // Si exite el producto se añade a las consultas como el where.
    if (producto != "") {
        rulesFind.where = { producto_cliente: producto }
        rulesCount.where = { producto_cliente: producto }
    }

    const querys = [

        // Obtener las suma de los montos de las promesas agrupandolas por el estatus de la promesa
        ClientesBancoAzteca.findAll(rulesCount),

        // Obtener las promesas de pago por un cierto rango de fecha y por un producto
        ClientesBancoAzteca.findAll(rulesFind),
    ];

    try {

        const resultado = await Promise.all(querys);
        return resultado;

    } catch (error) {

        console.log(error);
        throw 'Algo salio mal al monmento de ejecutar el promise';
    }
}


const getPromesasClientesCameFilter = async ({ fecha_inicio, fecha_limite, producto, nuevas }) => {

    let whereRule = {
        [Op.or]: [
            where(fn('format', col('fecha_promesa'), 'yyyy-MM-dd'), {
                [Op.between]: [fecha_inicio, fecha_limite]
            })
        ],
        id_promesa: {
            [Op.in] : [literal(` SELECT MAX(id_promesa) from promesas_pago_cames group by id_socio`)]
        }


    }

    if (nuevas !== '') {
        whereRule = {
            [Op.or]: [
                where(fn('format', col('fecha_promesa'), 'yyyy-MM-dd'), {
                    [Op.between]: [fecha_inicio, fecha_limite]
                })
            ],
            estatus: 'proceso',
            id_socio: {
                [Op.notIn]: [literal(` SELECT DISTINCT id_socio FROM [promesas_pago_cames] WHERE estatus = 'rota'`)]
            }

        }
    }

    //TODO Reglas para el hacer el de las promesas 
    const rulesFind = {

        include: [
            {
                model: PromesasPagoCame,
                attributes: [],
                where: whereRule
            },
            {
                model: Productos,
                as: 'producto_came',
                attributes: []
            }
        ],
        attributes: [
            // columnas clientes
            ['id_socio', 'id_cliente'],
            ['nombre_socio', 'nombre_cliente'],

            // Columnas promeas-pagos
            [literal('"promesas_pago_cames"."id_promesa"'), "id_promesa"],
            [literal('"promesas_pago_cames"."gestor"'), "gestor"],
            [fn('format', literal('"promesas_pago_cames"."fecha_gestion"'), 'yyyy-MM-dd'), 'fecha_gestion'],
            [fn('format', literal('"promesas_pago_cames"."fecha_promesa"'), 'yyyy-MM-dd'), 'fecha_promesa'],
            [literal("'Came'"), 'firma'],
            [literal('"promesas_pago_cames"."monto"'), "monto"],
            [literal('"promesas_pago_cames"."estatus"'), "estatus"],

            // Columnas productos
            [literal('"producto_came"."nombre_producto"'), "nombre_producto"]
        ],
        raw: true,
        order: [[literal('"promesas_pago_cames"."fecha_gestion"'), 'ASC']],
        // limit: 10
    }


    // TODO Reglas para hacer el find de las promesas y agrupalar par hacer el conto
    const rulesCount = {

        include: [
            {
                model: PromesasPagoCame,
                attributes: [],
                where: whereRule
            }
        ],
        attributes: [
            [fn('count', col("*")), 'total_promesa'],
            [literal("'came'"), 'firma'],
            [literal('"promesas_pago_cames"."estatus"'), "estatus"],
            [fn('sum', col("monto")), 'suma_promesas']
        ],
        group: ['estatus'],
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

        const clientesCame = Promise.all(querys);
        return clientesCame;

    } catch (error) {

        console.log({
            ubicacion: 'funcion getPromesasClientesCameFilter',
            error
        });
    }
}

const getPromesasClientesApoyoEconomicoFilter = async ({ fecha_inicio, fecha_limite, producto, nuevas }) => {

    let whereRule = {
        [Op.or]: [
            where(fn('format', col('fecha_promesa'), 'yyyy-MM-dd'), {
                [Op.between]: [fecha_inicio, fecha_limite]
            })
        ],
        id_promesa: {
            [Op.in] : [literal(`SELECT MAX(id_promesa) from promesas_pago_apoyo_economicos group by operacionesid`)]
        }
    }

    if (nuevas !== '') {
        whereRule = {
            [Op.or]: [
                where(fn('format', col('fecha_promesa'), 'yyyy-MM-dd'), {
                    [Op.between]: [fecha_inicio, fecha_limite]
                })
            ],
            estatus: 'proceso',
            operacionesid: {
                [Op.notIn]: [literal(` SELECT DISTINCT [operacionesid] FROM [promesas_pago_apoyo_economicos] WHERE estatus = 'rota'`)]
            }

        }
    }

    const rulesFind = {
        include: [
            {
                model: PromesasPagoApoyoEconomico,
                attributes: [],
                where: whereRule
            },
            {
                model: Productos,
                as: 'producto_apoyo_economico',
                attributes: []
            }
        ],
        attributes: [
            // Columnas cliente
            ['operacionesid', 'id_cliente'],
            ['nombre_cte', 'nombre_cliente'],

            // Columnas promesas pagos
            [literal('"promesas_pago_apoyo_economicos"."id_promesa"'), "id_promesa"],
            [literal('"promesas_pago_apoyo_economicos"."gestor"'), "gestor"],
            [fn('format', literal('"promesas_pago_apoyo_economicos"."fecha_gestion"'), 'yyyy-MM-dd'), 'fecha_gestion'],
            [fn('format', literal('"promesas_pago_apoyo_economicos"."fecha_promesa"'), 'yyyy-MM-dd'), 'fecha_promesa'],
            [literal("'apoyo economico'"), 'firma'],
            [literal('"promesas_pago_apoyo_economicos"."monto"'), "monto"],
            [literal('"promesas_pago_apoyo_economicos"."estatus"'), "estatus"],

            // Columnas productos.
            [literal('"producto_apoyo_economico"."nombre_producto"'), "nombre_producto"]

        ],
        raw: true,
        order: [[literal('"promesas_pago_apoyo_economicos"."fecha_gestion"'), 'asc']],
        // limit: 100000
    }


    // TODO Reglas para hacer el find de las promesas y agrupalar par hacer el conto
    const rulesCount = {
        include: [
            {
                model: PromesasPagoApoyoEconomico,
                attributes: [],
                where: whereRule
            }
        ],
        attributes: [
            [fn('count', col("*")), 'total_promesa'],
            [literal("'Apoyo_Economico'"), 'firma'],
            [literal('"promesas_pago_apoyo_economicos"."estatus"'), "estatus"],
            [fn('sum', literal('"promesas_pago_apoyo_economicos"."monto"')), 'suma_promesas']
        ],
        group: ['estatus'],
        raw: true
    }

    if (producto != '') {
        rulesFind.where = { producto_cliente: producto }
        rulesCount.where = { producto_cliente: producto }
    }


    // Querys
    const querys = [
        clientesApoyoEconomico.findAll(rulesCount),
        clientesApoyoEconomico.findAll(rulesFind),
    ];


    try {

        const clientesApoyo = await Promise.all(querys);
        return clientesApoyo

    } catch (error) {

        console.log(error);

    }



}



module.exports = {
    getPromesasClientesBancoAztecaFilter,
    getPromesasClientesCameFilter,
    getPromesasClientesApoyoEconomicoFilter
}

