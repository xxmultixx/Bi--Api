const db = require("../models");
const { QueryTypes } = require('sequelize');



module.exports.registraNumero = async (req, res ) => {

    const { idcredito,agente,telefono,tipoPertenencia,nombreTitular,extension,comentarios,identificador } = req.body
 

    try {
        const sql = `EXEC SP_registraTelAdicional 
        @idcredito = ? ,
        @agente = ? ,
        @telefono = ? ,
        @tipoPertenencia = ? ,
        @nombreTitular = ? ,
        @extension = ? ,
        @comentarios = ? ,
        @identificador = ? ;`

    
        const response = await db.query(sql, {
            replacements: [idcredito,agente,telefono,tipoPertenencia,nombreTitular,extension,comentarios,identificador],
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
                msg: 'La carga se subió de manera exitosa',
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