const Sequelize = require("sequelize");
const clientesApoyoEconomico = require("../models/clientes-apoyo-economico.model");
const ClientesBancoAzteca = require("../models/clientes-banco-azteca.model");
const ClientesCamel = require("../models/clientes-camel.model");
const Firma = require("../models/firma.model");
const Pagos = require("../models/pagos.model");
const PromesasPagoApoyoEconomico = require("../models/promesas-pago-apoyo-economico.model");
const PromesasPagoCame = require("../models/promesas-pago-came.model");
const PromesasPago = require("../models/promesas-pago.model");
const { QueryTypes } = require('sequelize');
const db = require("../models");

module.exports.mostrarMisPromesas = async (req, res) => {

    const { usuario } = req?.payload;

    try {

        let promesas = [];

        const promesas_banco_azteca = await PromesasPago.findAll({
            include: [
                {
                    model: ClientesBancoAzteca,
                    attributes: [
                        'nombre_cte',
                        'activo',
                    ],
                    include: [
                        {
                            model: Firma,
                            attributes: ['nombre'],
                            as : 'firmaa'
                        }
                    ]
                }
            ],
            attributes: [
                ["cliente_unico", 'id_cliente'],
                "fecha_gestion",
                "telefono_contacto",
                "tipo_telefono",
                "id_tipificacion",
                "gestor",
                "fecha_promesa",
                "estatus",
                "monto",
                "comentario",
                "tipo",
                [Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa'],
                [Sequelize.literal('"clientes_banco_azteca"."nombre_cte"'), 'nombre_cliente'],
                [Sequelize.literal('"clientes_banco_azteca->firmaa".nombre'), 'nombre_firma'],
                [Sequelize.literal('"clientes_banco_azteca"."activo"'), 'cliente_activo'],
                // [Sequelize.literal('"firmaa"."nombre"'), 'firma_cliente']
                // ['clientes_banco_azteca.nombre_cte','nombre_cliente']    
            ],
            where: {
                gestor: usuario
            },
            order: [['fecha_promesa', 'ASC']],
            raw: true
        });

        const promesas_came = await PromesasPagoCame.findAll({
            include: [
                {
                    model: ClientesCamel,
                    attributes: [
                        'nombre_socio',
                        'activo',
                    ],
                    include: [
                        {
                            model: Firma,
                            attributes: ['nombre'],
                            as : 'firma_came'
                        }
                    ]
                }
            ],
            attributes: [
                ["id_socio", 'id_cliente'],
                "fecha_gestion",
                "telefono_contacto",
                "tipo_telefono",
                "id_tipificacion",
                "gestor",
                "fecha_promesa",
                "estatus",
                "monto",
                "comentario",
                "tipo",
                [Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa'],
                [Sequelize.literal('"clientes_came"."nombre_socio"'), 'nombre_cliente'],
                [Sequelize.literal('"clientes_came->firma_came".nombre'), 'nombre_firma'],
                [Sequelize.literal('"clientes_came"."activo"'), 'cliente_activo'],
                // [Sequelize.literal('"firmaa"."nombre"'), 'firma_cliente']
                // ['clientes_banco_azteca.nombre_cte','nombre_cliente']    
            ],
            where: {
                gestor: usuario
            },
            order: [['fecha_promesa', 'ASC']],
            raw: true
        });

        const promesas_apoyo_economico = await PromesasPagoApoyoEconomico.findAll({
            include: [
                {
                    model: clientesApoyoEconomico,
                    attributes: [
                        'nombre_cte',
                        'activo',
                    ],
                    include: [
                        {
                            model: Firma,
                            attributes: ['nombre'],
                            as : 'firma_apoyo_economico'
                        }
                    ]
                }
            ],
            attributes: [
                ["operacionesid", 'id_cliente'],
                "fecha_gestion",
                "telefono_contacto",
                "tipo_telefono",
                "id_tipificacion",
                "gestor",
                "fecha_promesa",
                "estatus",
                "monto",
                "comentario",
                "tipo",
                [Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa'],
                [Sequelize.literal('"clientes_apoyo_economico"."nombre_cte"'), 'nombre_cliente'],
                [Sequelize.literal('"clientes_apoyo_economico->firma_apoyo_economico".nombre'), 'nombre_firma'],
                [Sequelize.literal('"clientes_apoyo_economico"."activo"'), 'cliente_activo'],  
            ],
            where: {
                gestor: usuario
            },
            order: [['fecha_promesa', 'ASC']],
            raw: true
        });

        promesas.push(...promesas_banco_azteca);
        promesas.push(...promesas_came);
        promesas.push(...promesas_apoyo_economico);

        return res.json({
            status: true,
            info: {
                msg: 'agenda promesas',
            },
            data: promesas
        })

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'agenda promesas'
            },
            data: []
        })
    }

}


module.exports.resumenPromesas = async (req, res ) => {

    const { usuario } = req?.payload;
 

    try {
        const sql = `EXEC [SP_GETAGENDA] 
        @GESTOR = ? ;`

    
        const response = await db.query(sql, {
            replacements: [ usuario],
            type: QueryTypes.RAW
        });
        
        if( response[0][0]?.error_carga == '1' ){
            return res.json({
                status: false,
                info: {
                    msg: response[0][0].mensaje
                },
                data: []
            })
        }

        return res.json({
            status: true,
            info: {
                msg: 'Obtencion de promesas con exito',
            },
            data: response[0][0]
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al obtener las promesas'
            },
            data: []
        })
    }


}

