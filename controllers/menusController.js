const db = require("../models");
const Interaciones = require("../models/interaciones.model");
require('dotenv').config();
process.env.TZ = 'America/Monterrey';
const { QueryTypes } = require('sequelize');

exports.mostrarInteracionesCliente = async ( req , res ) => {
    
    const {cliente_unico} = req.params;

    const {  page = 1 , limit = 15  } =  req.query;

    const  statement = {
        where : {
            cliente_unico : cliente_unico
        },
        offset: parseInt( ( page - 1 ) * limit ), 
        limit: parseInt(limit),
        order : [['id','DESC']]
    }

    try {

        const sql = `SELECT 
        interaciones.id_interaccion, interaciones.cliente_unico,
        interaciones.fecha_gestion,interaciones.telefono_contacto,
        interaciones.tipo_telefono, interaciones.gestor,interaciones.comentario,
        tipificaciones.codigo_accion,tipificaciones.codigo_accion_siglas,
        tipificaciones.codigo_resultado,tipificaciones.codigo_resultado_siglas
        FROM interaciones 
        inner join tipificaciones on tipificaciones.id_tipificacion = interaciones.id_tipificacion
        where interaciones.cliente_unico = :cliente_unico 
        order by interaciones.fecha_gestion desc`;

        const interaciones = await db.query(sql, {
            replacements: { cliente_unico: cliente_unico },
            type: db.Sequelize.QueryTypes.SELECT
        });

        return res.json({
            status : true ,
            info : {
                msg : '',
                // total : interaciones.count ,
                // pages : Math.ceil( interaciones.count / limit ),
                // current_page : page
            },
            data : interaciones
        });

    } catch (error) {
        console.error(error);
        return res.json({
            status : false ,
            info : {
                msg : ''
            },
            data : [] 
        })
    }
}



exports.nuevaInteraccion = async ( req, res ) => {
    
    const interacion = new Interaciones(req.body);

    try {
        
        await interacion.save();

        return res.json({
            status : true ,
            info : {
                msg : 'Se agrego la interacción con éxito'
            },
            data : [] 
        })

    } catch (error) {
        return res.json({
            status : false ,
            info : {
                msg : 'No se pudo crear el nuevo usuario'
            },
            data : [] 
        })
        console.error(error);
    }
}

module.exports.seguimientos = async (req, res ) => {

    const { usuario } = req?.payload;
 

    try {
        const sql = `EXEC SP_GET_SEGUIMIENTOS 
        @USUARIO = ? ;`

    
        const response = await db.query(sql, {
            replacements: [usuario],
            type: QueryTypes.RAW
        });
        console.log("response:" +response[0][0]);
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
                msg: 'ConsumoExitoso',
            },
            data: response[0]
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


module.exports.desactivaSeguimiento = async (req, res ) => {

    const { tipo,id } = req.body;
 

    try {
        const sql = `EXEC SP_DESACTIVASEGUIMIENTO 
        @TIPO = ?,
        @ID = ? ;`

    
        const response = await db.query(sql, {
            replacements: [ tipo,id],
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
                msg: 'ConsumoExitoso',
            },
            data: response[0]
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





module.exports.promesa = async (req, res ) => {

    const { idinteraccion,cliente,telefonoContacto,idTipificacion,gestor,fechaPromesa, monto,comentario,tipoPromesa,tipo } = req.body
 

    try {
        const sql = `EXEC SP_RegistraPromesas 
        @idinteraccion = ? ,
        @cliente = ? ,
        @telefonoContacto = ? ,
        @idTipificacion = ? ,
        @gestor = ? ,
        @fechaPromesa = ? ,
        @monto = ? ,
        @comentario = ? ,
        @tipoPromesa = ? ,
        @tipo= ? ;`

    
        const response = await db.query(sql, {
            replacements: [idinteraccion,cliente,telefonoContacto,idTipificacion,gestor,fechaPromesa, monto,comentario,tipoPromesa,tipo ],
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



module.exports.obtenerAcciones = async ( req , res ) => {

    


}



module.exports.pagosComisiones = async (req, res ) => {

    const { opcion,semana,anio,gestor } = req.body;
 

    try {
        const sql = `EXEC SP_PAGOSCOMISIONES 
        @opcion = ?,
        @semana = ?,
        @anio =  ?,
        @gestor = ? ;`

    
        const response = await db.query(sql, {
            replacements: [ opcion,semana,anio,gestor],
            type: QueryTypes.RAW
        });
        console.log("response:" +response[0][0]);
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
                msg: 'ConsumoExitoso',
            },
            data: response[0]
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




module.exports.pagosComisionesGet = async (req, res ) => {

    const { opcion,semana,anio,gestor } = req.params;
 

    try {
        const sql = `EXEC SP_PAGOSCOMISIONES 
        @opcion = :opcion,
        @semana = :semana,
        @anio =  :anio,
        @gestor = :gestor ;`

    
        const response = await db.query(sql, {
            replacements: { opcion : opcion,semana :semana ,anio :anio,gestor:gestor},
            type: QueryTypes.SELECT
        });
        console.log("response:" +response[0][0]);
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
                msg: 'ConsumoExitoso',
            },
            data: response
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



module.exports.desactivarPromesas = async (req, res ) => {

    

    try {
        const sql = `EXEC SP_GETDESACTIVACIONESPROMESAS ;`

    
        const response = await db.query(sql, {
           
            type: QueryTypes.SELECT
        });
        console.log("response:" +response[0][0]);
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
                msg: 'ConsumoExitoso',
            },
            data: response
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


module.exports.desactivarPromesasMasivo = async (req, res ) => {

    const { usuario } = req?.payload;

    try {
        const sql = `EXEC SP_POSTDESACTIVACIONESPROMESAS
        @USUARIO = ? ;`

    
        const response = await db.query(sql, {
            replacements: [usuario],
            type: QueryTypes.RAW
        });
        console.log("response:" +response[0][0]);
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
                msg: 'ConsumoExitoso',
            },
            data: response[0]
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



module.exports.rankingGerencias = async (req, res ) => {

    const { opcion,semana,anio,gestor } = req.body;
 

    try {
        const sql = `EXEC SP_RANKINGGERENCIAS  ;`

    
        const response = await db.query(sql, {
            replacements: [ opcion,semana,anio,gestor],
            type: QueryTypes.RAW
        });
        console.log("response:" +response[0][0]);
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
                msg: 'ConsumoExitoso',
            },
            data: response[0]
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



module.exports.comparativopromesasxagente = async (req, res ) => {

    const { usuario } = req?.payload;
 
 

    try {
        const sql = `EXEC SP_COMPARATIVOPROMESASXAGENTE 
        @GESTOR = ? ;`

    
        const response = await db.query(sql, {
            replacements: [usuario],
            type: QueryTypes.RAW
        });
        console.log("response:" +response[0][0]);
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
                msg: 'ConsumoExitoso',
            },
            data: response[0]
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



module.exports.competitividad = async (req, res ) => {

    const { opcion,equipo } = req.body;
 

    try {
        const sql = `EXEC SP_GETCOMPETITIVIDAD 
        @OPCION = ? ,
        @IDGRUPO = ? ;`

    
        const response = await db.query(sql, {
            replacements: [opcion,equipo],
            type: QueryTypes.RAW
        });
        console.log("response:" +response[0][0]);
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
                msg: 'ConsumoExitoso',
            },
            data: response[0]
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