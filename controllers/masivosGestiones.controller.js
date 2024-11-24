const db = require("../models");
const { QueryTypes } = require('sequelize');

module.exports.masivosGestiones = async (req, res ) => {

    const {  file_path, file_name,usuario,tipificacion,tipoCarga,gestor} = req.body
  

    try {
        const sql = `EXEC sp_masivos_gestiones 
        @url_archivo_masivo = ? ,
        @nombre_archivo = ? ,
        @usuario = ? ,
        @tipificacion = ? ,
        @tipoCarga = ? ,
        @gestor = ? ;`

    
        const response = await db.query(sql, {
            replacements: [ file_path, file_name,usuario,tipificacion,tipoCarga,gestor],
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


module.exports.eliminaMasivoGestion = async (req, res ) => {

    const { idcarga} = req.body
  

    try {
        const sql = `EXEC SP_POSTCARGAGESTIONES 
        @IDCARGA = ? ;`

    
        const response = await db.query(sql, {
            replacements: [ idcarga],
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

