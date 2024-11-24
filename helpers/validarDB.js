const { Sequelize } = require('sequelize');
const db = require('../models');
const clientesApoyoEconomico = require("../models/clientes-apoyo-economico.model");
const ClientesBancoAzteca = require("../models/clientes-banco-azteca.model");
const ClientesCamel = require("../models/clientes-camel.model");
const Convenio = require("../models/convenios-banco-azteca.model");
const ConvenioPago = require("../models/convenioPago.model");
const Firma = require('../models/firma.model');
const Productos = require('../models/productos.model');
const PromesasPagoApoyoEconomico = require('../models/promesas-pago-apoyo-economico.model');
const PromesasPagoCame = require('../models/promesas-pago-came.model');
const PromesasPago = require("../models/promesas-pago.model")



const exitePromesaPago = async ({ cliente_unico, firma = 'banco_azteca' }) => {


    switch (firma) {
        case 'banco_azteca':
            return await PromesasPago.findOne({
                where: {
                    cliente_unico: cliente_unico,
                    estatus: 'proceso'
                } // este tipo de where hace referencia a un AND
            });

        case 'came':
            return await PromesasPagoCame.findOne({
                where: {
                    id_socio: cliente_unico,
                    estatus: 'proceso'
                } // este tipo de where hace referencia a un AND
            });

        case 'apoyo_economico':
            return await PromesasPagoApoyoEconomico.findOne({
                where: {
                    operacionesid: cliente_unico,
                    estatus: 'proceso'
                } // este tipo de where hace referencia a un AND
            });

        default:
            break;
    }

}


/**
 * Busca si un cliente tiene un convenio en proceso.
 * 
 * @param {string|int} cliente_unico ID del cliente unico
 * @param {bool} asosiation Indica si quieres traer los convenioPago al momento de buscar el resgistro
 * @returns {Object} Retorna un objeto si encuentra encuentra coincidencias en base o null si no encuentra nada
 */
const exiteConvenioActivo = async (cliente_unico, asosiation = false) => {


    const reglas = {
        where: {
            cliente_unico: cliente_unico,
            estatus: 'proceso'
        }
    }

    // Si quiero traer las osociaciones
    if (asosiation) {
        reglas.include = [
            { model: ConvenioPago, attributes: ['id', 'id_convenio', 'num_pago', 'fecha', 'comprobante', 'monto', 'estatus'] },
            { model: ClientesBancoAzteca, attributes: ['nombre_cte'] }
        ]
    }

    try {

        const exiteConvenio = await Convenio.findOne(reglas);
        return exiteConvenio;

    } catch (error) {
        console.error(error);
        throw new CustomError(error);
    }

}


/**
 * 
 * Esta funcion se encarga de hacer una busqueda por el id y los numeros telefonicos
 * en las diferentes tablas de clientes que se tiene como modelos.
 * 
 *
 * @param {string} cliente el id del cliente con el que se buscara el las tablas de clientes(apoyo economico, camel,banco anteza)
 * @param {string|number} dnis El numero telefonico con el que se quiere hacer la busqueda
 * @returns {object} Retorna un objeto en donde se encuentra la firma a la que pertenece el cliente y el cliente(s) encontrados 
 */
const buscarCliente = async ({ cliente = null, dnis = null, tipo = null, firma }) => {

    const response = [];

    try {

        const querys = [

            // Buscar el cliente en banco azteca por el id ó los telefonos
            ClientesBancoAzteca.findAll({
                where: {
                    [Sequelize.Op.or]: [
                        { cliente_unico: cliente },
                        { 'telefono1': dnis },
                        { 'telefono2': dnis },
                        { 'telefono3': dnis },
                        { 'telefono4': dnis },
                    ]
                },
                include: [
                    {
                        model: PromesasPago,
                        where: { estatus: 'proceso' },
                        attributes: [
                            'id_promesa',
                            [Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa']
                        ],
                        required: false
                    },
                    {
                        model: Firma,
                        attributes: ['nombre'],
                        as: 'firmaa'
                    }
                ],
                attributes: [
                    ...Object.keys(ClientesBancoAzteca.rawAttributes),
                    [Sequelize.literal('"firmaa"."nombre"'), "nombre_firma"]
                ]
            }),

            // Buscar el cliente en apoyo economico por el id ó los telefonos
            clientesApoyoEconomico.findAll({
                where: {
                    [Sequelize.Op.or]: [
                        { operacionesid: cliente },
                        { 'tel1': dnis },
                        { 'tel2': dnis },
                        { 'cel': dnis }
                    ]
                },
                include: [
                    {
                        model: PromesasPagoApoyoEconomico,
                        where: { estatus: 'proceso' },
                        attributes: [
                            'id_promesa',
                            [Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa']
                        ],
                        required: false
                    },
                    {
                        model: Firma,
                        attributes: ['nombre'],
                        as: 'firma_apoyo_economico'
                    }
                ],
                attributes: [
                    ...Object.keys(clientesApoyoEconomico.rawAttributes),
                    [Sequelize.literal('"firma_apoyo_economico"."nombre"'), "nombre_firma"]
                ]
            }),

            // Buscar el cliente en camel por el id ó los telefonos
            ClientesCamel.findAll({
                where: {
                    [Sequelize.Op.or]: [
                        { id_socio: cliente },
                        { 'telefono': dnis },
                        { 'telefono2': dnis }
                    ]
                },
                include: [
                    {
                        model: PromesasPagoCame,
                        where: { estatus: 'proceso' },
                        attributes: [
                            'id_promesa',
                            [Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa']
                        ],
                        required: false
                    },
                    {
                        model: Firma,
                        attributes: ['nombre'],
                        as: 'firma_came'
                    }
                ],
                attributes: [
                    ...Object.keys(ClientesCamel.rawAttributes),
                    [Sequelize.literal('"firma_came"."nombre"'), "nombre_firma"]
                ]
            })
        ]

        const [cBancoAzteca, cApoyoEconomico, cCamel] = await Promise.all(querys);

        if (cBancoAzteca.length > 0) {
            cBancoAzteca.forEach(cliente => response.push({ firma: 'Banco_Azteca', cliente: cliente }));
        }
        if (cApoyoEconomico.length > 0) {
            cApoyoEconomico.forEach(cliente => response.push({ firma: 'Apoyo_Economico', cliente: cliente }));
        }
        if (cCamel.length > 0) {
            cCamel.forEach(cliente => response.push({ firma: 'Camel', cliente: cliente }));
        }


        // if (cBancoAzteca) {
        //     response.push({ firma: 'Apoyo_Economico', cliente: cBancoAzteca });
        // }


        // if (cApoyoEconomico) {
        //     response.push({ firma: 'Apoyo_Economico', cliente: cApoyoEconomico });
        // }

        // if (cCamel) {
        //     response.push({ firma: 'Camel', cliente: cCamel });
        // }

        return response;

    } catch (error) {
        console.error(error);
        return []
    }

}

const validarNumeroClientes = async (telefonos = [], firma) => {

    const promesas = [];
    const tipoNumero = [];
    const telefonos_validos = [];

    for (let index = 0; index < telefonos.length; index++) {

        telefonos_validos.push({ numero_telefono: `telefono${index + 1}`, tel: telefonos[index] })

        const sql = `EXEC SP_IDENTIFICADOR :telefono  `;

        const numero_promise = db.query(sql, {
            replacements: { telefono: telefonos[index] }
        });

        promesas.push(numero_promise);
    }

    await Promise.all(promesas).then(response => {

        response.forEach((response) => {

            if (response[0][0]?.[' TIPO_RED']) {

                tipoNumero.push(response[0][0]?.[' TIPO_RED']);

            } else {

                tipoNumero.push('telefono_novalido');

            }


        })
    })


    return tipoNumero;

}

module.exports = {
    exitePromesaPago,
    exiteConvenioActivo,
    buscarCliente,
    validarNumeroClientes
}