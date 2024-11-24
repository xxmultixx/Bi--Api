const { Op } = require("sequelize");
const ClientesBancoAzteca = require("../models/clientes-banco-azteca.model");
const PromesasPago = require("../models/promesas-pago.model");
const db = require('../models/index');
const { QueryTypes } = require('sequelize');
require('dotenv').config();
process.env.TZ = 'America/Monterrey';


module.exports.nuevoCliente = async (req, res) => {

    let clientes = [];

    let mensaje = {
        insertados: 0,
        no_insertados: 0,
    }

    req.body.forEach(async (info_cliente) => {
        try {

            info_cliente.clave_spei = info_cliente.clave_spei == 'N/A' ? 'N/A' : `${info_cliente.clave_spei}`;

            const cliente = new ClientesBancoAzteca(info_cliente);

            await cliente.save();

            mensaje.insertados += 1;

        } catch (error) {
            // console.error(error);
            mensaje.no_insertados += 1;
        }
    });

    const datos_limpios = req.body.map(async (info_cliente) => {

        info_cliente.clave_spei = info_cliente.clave_spei == 'N/A' ? 'N/A' : `${info_cliente.clave_spei}`;


        return info_cliente;

    });


    try {
        // ClientesBancoAzteca.bulkCreate( datos_limpios ).then(() => console.log("Users data have been saved")).catch(error => {
        //     console.error(error);
        //     console.log('no se pudo :( ');
        // });
        // const clientes =  await ClientesBancoAzteca.bulkCreate(req.body);
        // const clientes = await ClientesBancoAzteca.bulkCreate(req.body);

        // await clientes.save();
        return res.json({
            status: true,
            info: {
                // msg : 'Cliente agregado con éxito'
                info: mensaje
            },
            data: []
        })

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                // msg : 'Cliente agregado con éxito'
                info: mensaje
            },
            data: []
        })
    }
}


module.exports.getTelefonosAdic = async (req, res ) => {
    const { cliente } = req.params;
    
    try {
       

        const sql = `EXEC SP_GETTELEFONOSADICIONALES 
        @CLIENTE = ?;`

    
        const resumen = await db.query(sql, {
            replacements: [cliente],
            type: QueryTypes.RAW
        });

       

        return res.json({
            status: true,
            info: {
                msg: 'ConsumoExitoso',
            },
            data: resumen[0]
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'No se obtubieron telefonos del cliente'
            },
            data: []
        })
    }


}
