const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const clientesApoyoEconomico = require('../models/clientes-apoyo-economico.model');
const ClientesBancoAzteca = require('../models/clientes-banco-azteca.model');
const ClientesCamel = require('../models/clientes-camel.model');
const Firma = require('../models/firma.model');

const searchClientesByKeyOrDnis = async (tipo, valor_busqueda) => {

    const querys = [

        // Buscar en la tabla clientes Banco Azteca
        ClientesBancoAzteca.findAndCountAll({
            where: {
                [Op.or]: [
                    ( { 'nombre_cte': { [Op.like]: `%${valor_busqueda}%` } }),
                    ( { 'cliente_unico': { [Op.like]: `%${valor_busqueda}%` } }),
                    ( {
                        [Op.or]: [
                            { 'telefono1': { [Op.like]: `%${valor_busqueda}%` } },
                            { 'telefono2': { [Op.like]: `%${valor_busqueda}%` } },
                            { 'telefono3': { [Op.like]: `%${valor_busqueda}%` } },
                            { 'telefono4': { [Op.like]: `%${valor_busqueda}%` } },
                        ]
                    })
                ]
            },
            /*
            [
                tipo == 'nombre_cte' && { 'nombre_cte': { [Op.like]: `%${valor_busqueda}%` } },
                tipo == 'cliente_unico' && { 'cliente_unico': { [Op.like]: `%${valor_busqueda}%` } },
                tipo == 'telefono' ? {
                    [Op.or]: [
                        { 'telefono1': { [Op.like]: `%${valor_busqueda}%` } },
                        { 'telefono2': { [Op.like]: `%${valor_busqueda}%` } },
                        { 'telefono3': { [Op.like]: `%${valor_busqueda}%` } },
                        { 'telefono4': { [Op.like]: `%${valor_busqueda}%` } },
                    ]
                } : ''
            ]
            */
            attributes: [
                ['cliente_unico', 'cliente_id'],
                ['nombre_cte', 'nombre_cliente'],
                ['telefono1', 'tel_1'],
                ['telefono2', 'tel_2'],
                ['telefono3', 'tel_3'],
                ['telefono4', 'tel_4'],
                'activo',
                [Sequelize.literal('"firmaa"."nombre"'),'nombre_firma']
            ],
            include : [
                { 
                    model : Firma ,
                    attributes : [ 'nombre' ],
                    as :'firmaa'
                }

            ],
            limit: 100
        }),

        // Buscar El clientes Apoyo Economico
        clientesApoyoEconomico.findAndCountAll({
            where: [
                tipo == 'nombre_cte' && { 'nombre_cte': { [Op.like]: `%${valor_busqueda}%` } },
                tipo == 'cliente_unico' && { 'operacionesid': { [Op.like]: `%${valor_busqueda}%` } },
                tipo == 'telefono' ? {
                    [Op.or]: [
                        { 'tel1': { [Op.like]: `%${valor_busqueda}%` } },
                        { 'tel2': { [Op.like]: `%${valor_busqueda}%` } },
                        { 'cel': { [Op.like]: `%${valor_busqueda}%` } },
                    ]
                } : ''
            ],
            attributes: [
                ['operacionesid', 'cliente_id'],
                ['nombre_cte', 'nombre_cliente'],
                ['tel1', 'tel_1'],
                ['tel2', 'tel_2'],
                ['cel', 'tel_3'],
                'activo',
                [Sequelize.literal('"firma_apoyo_economico"."nombre"'),'nombre_firma']
            ],
            include : [
                { 
                    model : Firma ,
                    attributes : [ 'nombre' ],
                    as :'firma_apoyo_economico'
                }
            ],
            limit: 100
        }),

        // Buscar el clientes camel
        ClientesCamel.findAndCountAll({
            where: [
                tipo == 'nombre_cte' && { 'nombre_socio': { [Op.like]: `%${valor_busqueda}%` } },
                tipo == 'cliente_unico' && {
                    [Op.or]: [
                        { 'id_socio': {  [Op.like]: `%${valor_busqueda}%` } },
                        { 'no_ggi': { [Op.like]: `%${valor_busqueda}%` } },
                    ]
                },
                tipo == 'telefono' ? {
                    [Op.or]: [
                        { 'telefono': { [Op.like]: `%${valor_busqueda}%` } },
                        { 'telefono2': { [Op.like]: `%${valor_busqueda}%` } },
                    ]
                } : ''
            ],
            attributes: [
                ['id_socio', 'cliente_id'],
                ['nombre_socio', 'nombre_cliente'],
                ['telefono', 'tel_1'],
                ['telefono2', 'tel_2'],
                'activo',
                [Sequelize.literal('"firma_came"."nombre"'),'nombre_firma'],
                'no_ggi'
            ],
            include : [
                { 
                    model : Firma ,
                    attributes : [ 'nombre' ],
                    as :'firma_came'
                }
            ],
            limit: 100
        })
    ];

    
    try {

        const [cClientesBancoAzteca, cClientesApoyoEcon, cClientesComal] = await Promise.all(querys);


        return [
            {
                firma: 'Banco_Azteca',
                total_registros: cClientesBancoAzteca.count,
                clientes: cClientesBancoAzteca.rows
            },
            {
                firma: 'Apoyo_Economico',
                total_registros: cClientesApoyoEcon.count,
                clientes: cClientesApoyoEcon.rows
            },
            {
                firma: 'Camel',
                total_registros: cClientesComal.count,
                clientes: cClientesComal.rows
            }
        ];

    } catch (error) {
        console.error(error);
    }


}





module.exports = {
    searchClientesByKeyOrDnis
}