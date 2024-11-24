const { Sequelize } = require("sequelize");
const db = require("../models");
const Pagos = require("../models/pagos.model");
const PromesasPago = require("../models/promesas-pago.model");
require('dotenv').config();
process.env.TZ = 'America/Monterrey';
const { QueryTypes } = require('sequelize');

module.exports.mostrarAccionesClientes = async (req, res) => {

    const { page = 1, limit = 15 , cliente = '' , offset = 0 } = req.query;

    try {

        const sql = `SELECT 
        promesas_pagos.fecha_gestion,
        promesas_pagos.fecha_promesa,
        promesas_pagos.telefono_contacto as telefono_promesa,
        
        FROM promesas_pagos 
        left join pagos on pagos.id_interaccion = promesas_pagos.id_interaccion
        left join tipificaciones on  tipificaciones.id_tipificacion = promesas_pagos.id_tipificacion
        WHERE usuarios.id = :cliente_unico`;

        const acciones = await db.query(sql, {
            replacements: { cliente_unico: cliente },
            type: db.Sequelize.QueryTypes.SELECT
        });

        return res.json({
            status: true,
            info: {
                msg: '',
                // total : acciones.count,
                // pages : Math.ceil( acciones.count / limit ),
                // current_page : page
            },
            data: acciones
        })

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'No se cargaron acciones',
                // total : clientes.count,
                // pages : Math.ceil( clientes.count / limit ),
                // current_page : page
            },
            data: []
        })
    }


}


module.exports.registraNumero = async (req, res ) => {

    const { idcredito,agente,codigoAccion,telefono,autorizacion,comentarios,identificador,password } = req.body
 

    try {
        const sql = `EXEC SP_INSERTADEMANDA 
        @CLIENTE = ? ,
        @AGENTE = ? ;`

    
        const response = await db.query(sql, {
            replacements: [idcredito,agente],
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
                msg: 'Se genero la demanda',
            },
            data: response[0][0]
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al generar demanda'
            },
            data: []
        })
    }


}



module.exports.eliminaNumero = async (req, res ) => {

    const { idcredito,agente } = req.body
 

    try {
        const sql = `EXEC SP_ELIMINADEMANDA 
        @CLIENTE = ? ,
        @AGENTE = ? ;`


    
        const response = await db.query(sql, {
            replacements: [idcredito,agente],
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
                msg: 'Se elimina demanda del cliente',
            },
            data: response[0][0]
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al eliminar demanda'
            },
            data: []
        })
    }


}