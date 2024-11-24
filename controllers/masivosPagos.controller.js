const db = require("../models");
const { QueryTypes } = require('sequelize');

module.exports.pagosClientes = async (req, res ) => {
    const { usuario } = req?.payload;
    const { firma, producto , file_name , file_path ,encabezados_archivo } = req.body
 
    console.log({encabezados_archivo});

    try {
        const sql = `EXEC sp_masivos_pagos 
        @firma_masivo = ? ,
        @producto_masivo = ? ,
        @url_archivo_masivo = ? ,
        @nombre_archivo = ? ,
        @usuario = ? ;`

    
        const response = await db.query(sql, {
            replacements: [firma, producto, file_path, file_name,usuario],
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


module.exports.getPagosSCL = async (req, res ) => {
   
    
    try {
        const sql = `EXEC SP_GETREGISTROPAGOSSCL;`

    
        const response = await db.query(sql, {
         
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
                msg: 'Consulta exitosa',
            },
            data: response[0]
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Error al consultar informacion'
            },
            data: []
        })
    }


}



module.exports.deleteMasivosSCL = async (req, res ) => {
   
    const { usuario } = req?.payload;
    const { idcarga } = req.body

    try {
        const sql = `EXEC SP_DELETEPAGOMASIVOSSCL
        @IDCARGA = ? ,
        @USUARIO = ?`

    
        const response = await db.query(sql, {
         replacements : [idcarga,usuario] ,
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
                msg: 'Consulta exitosa',
            },
            data: response[0]
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Error al consultar informacion'
            },
            data: []
        })
    }


}