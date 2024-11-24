const db = require("../models");
const { QueryTypes } = require('sequelize');



module.exports.registraNumero = async (req, res ) => {

    const { idcredito,agente,codigoAccion,telefono,autorizacion,comentarios,identificador,password } = req.body
 

    try {
        const sql = `EXEC SP_InsertaListaNegra 
        @idcredito = ? ,
        @agente = ? ,
        @codigoAccion = ? ,
        @telefono = ? ,
        @autorizacion = ? ,
        @comentario = ? ,
        @identificador = ? ;`

    
        const response = await db.query(sql, {
            replacements: [idcredito,agente,codigoAccion,telefono,autorizacion,comentarios,identificador,password],
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
                msg: 'El numero se agrego a lista negra',
            },
            data: response[0][0]
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al subir la carga'
            },
            data: []
        })
    }


}



module.exports.eliminaNumero = async (req, res ) => {

    const { idcredito,agente,telefono,identificador } = req.body
 

    try {
        const sql = `EXEC SP_SACALISTANEGRA 
        @idcredito = ? ,
        @agente = ? ,
        @telefono = ? ,
        @identificador = ? ;`

    
        const response = await db.query(sql, {
            replacements: [idcredito,agente,telefono,identificador],
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
                msg: 'El numero se saco de lista negra',
            },
            data: response[0][0]
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al subir la carga'
            },
            data: []
        })
    }


}