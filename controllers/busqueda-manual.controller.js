const { Op } = require("sequelize");
const buscarClienteIn = require("../helpers/buscarClienteIn");
const { searchClientesByKeyOrDnis } = require("../helpers/search-clientes");
const ClientesBancoAzteca = require("../models/clientes-banco-azteca.model");
require('dotenv').config();
process.env.TZ = 'America/Monterrey';

module.exports.busquedaManualIn = async (req, res) => {


    const { nombre = '', id_credito = '', telefono = '' } = req.query;


    try {

        const clientes =  await buscarClienteIn({
            cliente : id_credito ,
            nombre : nombre ,
            dnis  : telefono
        })

        return res.json({
            estatus: true,
            info: {
                msg: 'Busqueda Manual'
            },
            data: clientes
        })

    } catch (error) {
        console.error(error);
        return res.json({
            estatus: false,
            info: {
                msg: 'error busqueda'
            },
            data: []
        })
    }


}


exports.obtenerClientesBitacora = async (req, res) => {

    const { tipo, valor_busqueda } = req.query;


    try {

        const clientes = await searchClientesByKeyOrDnis(tipo, valor_busqueda);

        if(clientes.length === 0){

            return res.json({ status: false, info: { msg: 'No se encontraron clientes con esas caracteristicas', }, data: clientes })

        }else{

            return res.json({ status: true, info: { msg: 'Clientes Encontrados', }, data: clientes })
        }

    } catch (error) {
        return res.json({
            status: false,
            info: {
                msg: ''
            },
            data: []
        })
        console.error(error);
    }
}



// exports.obtenerClientesBitacora = async (req, res) => {

//     const { tipo, valor_busqueda, page = 1, limit = 50 } = req.query;

//     const statement = {
//         where:
//             [tipo == 'nombre_cte' && { 'nombre_cte': { [Op.like]: `%${valor_busqueda}%` } },
//             tipo == 'cliente_unico' && { 'cliente_unico': { [Op.like]: `%${valor_busqueda}%` } },
//             tipo == 'telefono' ? {
//                 [Op.or]: [
//                     { 'telefono1': { [Op.like]: `%${valor_busqueda}%` } },
//                     { 'telefono2': { [Op.like]: `%${valor_busqueda}%` } },
//                     { 'telefono3': { [Op.like]: `%${valor_busqueda}%` } },
//                     { 'telefono4': { [Op.like]: `%${valor_busqueda}%` } },
//                 ]
//             } : ''
//             ]
//         ,
//         offset: parseInt((page - 1) * limit),
//         limit: parseInt(limit)
//     }

//     try {
//         const clientes = await ClientesBancoAzteca.findAndCountAll(statement);

//         return res.json({
//             status: true,
//             info: {
//                 msg: '',
//                 total: clientes.count,
//                 pages: Math.ceil(clientes.count / limit),
//                 current_page: page
//             },
//             data: clientes.rows
//         })

//     } catch (error) {
//         return res.json({
//             status: false,
//             info: {
//                 msg: ''
//             },
//             data: []
//         })
//         console.error(error);
//     }
// }