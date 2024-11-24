const db = require("../models");
const { QueryTypes } = require('sequelize');



module.exports.masivosClientes = async (req, res ) => {
    const { usuario } = req?.payload;
    const { firma, producto , file_name , file_path ,desactivaCreditos, encabezados_archivo } = req.body

    console.log({encabezados_archivo});

    try {
        const sql = `EXEC sp_masivos 
        @firma_masivo = ? ,
        @producto_masivo = ? ,
        @url_archivo_masivo = ? ,
        @nombre_archivo = ? ,
        @desactivaCreditos = ? ,
        @usuario = ? ;`

    
        const response = await db.query(sql, {
            replacements: [firma, producto, file_path, file_name,desactivaCreditos,usuario],
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

module.exports.masivosDemandas = async (req, res ) => {
    const { usuario } = req?.payload;
    const { file_name , file_path ,firma, producto , encabezados_archivo } = req.body

    console.log({encabezados_archivo});

    try {
        const sql = `EXEC sp_masivos_demandas 
        @url_archivo_masivo = ? ,
        @nombre_archivo = ? ,
        @usuario = ? ,
        @firma = ? ,
        @producto = ? 
        ;`

    
        const response = await db.query(sql, {
            replacements: [ file_path, file_name,usuario,firma, producto],
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


module.exports.getDemandas = async (req, res ) => {
   
    
    try {
        const sql = `EXEC SP_GETDEMANDAS;`

    
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



module.exports.deleteDemandas = async (req, res ) => {
   
    const { usuario } = req?.payload;
    const { idcarga } = req.body

    try {
        const sql = `EXEC SP_DELETEDEMANDAS
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

module.exports.getSMSMasivos = async (req, res ) => {
   
    
    try {
        const sql = `EXEC SP_GET_SMSMASIVO;`

    
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

///////////////////////////SECCION RDM //////////////////////////////////7

module.exports.masivosRDM = async (req, res ) => {
    const { usuario } = req?.payload;
    const { file_name , file_path , encabezados_archivo } = req.body

    console.log({encabezados_archivo});

    try {
        const sql = `EXEC sp_masivos_RDM
        @url_archivo_masivo = ? ,
        @nombre_archivo = ? ,
        @usuario = ? 
        ;`

    
        const response = await db.query(sql, {
            replacements: [ file_path, file_name,usuario],
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


module.exports.getRDM = async (req, res ) => {
   
    
    try {
        const sql = `EXEC SP_GETRDM;`

    
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



module.exports.deleteRDM = async (req, res ) => {
   
    const { usuario } = req?.payload;
    const { idcarga } = req.body

    try {
        const sql = `EXEC SP_DELETERDM
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

