const { Module } = require("module");
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

module.exports.gestion = async (req, res ) => {

    const { idinteraccion,cliente,telefonoContacto,idTipificacion,gestor,comentario,ani,tipo,seguimiento,codigoDictaminacion } = req.body
 

    try {
        const sql = `EXEC SP_RegistraInteraccion 
        @idinteraccion = ? ,
        @cliente = ? ,
        @telefonoContacto = ? ,
        @idTipificacion = ? ,
        @gestor = ? ,
        @comentario = ? ,
        @ani = ? ,
        @tipo = ? ,
        @seguimiento = ? ,
        @dictaminacion = ? ;`

    
        const response = await db.query(sql, {
            replacements: [idinteraccion,cliente,telefonoContacto,idTipificacion,gestor,comentario,ani,tipo,seguimiento,codigoDictaminacion],
            type: QueryTypes.RAW
        });
        
       
        if( response[0][0].RESULT == 1 ){
            return res.json({
                status: true,
                info: {
                    msg: 'La gestion se guardo de forma correcta.',
                },
                data: []
            })
        }
        
        if( response[0][0].RESULT == 2 ){
            return res.json({
                status: true,
                info: {
                    msg: 'La gestion se guardo de forma correcta.',
                },
                data: []
            })
        }
        if( response[0][0].RESULT == 3 ){
            return res.json({
                status: false,
                info: {
                    msg: 'El numero de telefono es invalido favor de revisarlo.',
                },
                data: []
            })
        }

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
         
        if( response[0][0].RESULT == 1 ){
            return res.json({
                status: true,
                info: {
                    msg: 'Se genera promesa con exito'
                },
                data: response[0][0]
            })
        }

        if( response[0][0]?.error_carga == '1' ){
            return res.json({
                status: false,
                info: {
                    msg: ''
                },
                data: response[0][0]
            })
        } 
        if( response[0][0].RESULT == 2){
            return res.json({
                status: false,
                info: {
                    msg: 'Cliente con promesa activa'
                },
                data: response[0][0]
            })
        }
        if( response[0][0].RESULT == 3){
            return res.json({
                status: false,
                info: {
                    msg: 'Favor de verificar el monto minimo'
                },
                data: response[0][0]
            })
        }

       


        return res.json({
            status: false,
            info: {
                msg: 'Error al generar promesa',
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


module.exports.editaPromesa = async (req, res ) => {

    const { idpromesa,idTipificacion,monto,fechaPromesa ,autoriza,idinteraccion,cliente,gestor,telefonoContacto } = req.body
 

    try {
        const sql = `EXEC [SP_EDITAPROMESA] 
        @IDPROMESA = ? ,
        @IDTIPIFICACION = ? ,
        @MONTO = ? ,
        @FECHA = ? ,
        @AUTORIZA = ? ,
        @IDINTERACCION = ? ,
        @CLIENTE = ? ,
        @GESTOR = ? ,
        @TELEFONO = ?
        ;`

    
        const response = await db.query(sql, {
            replacements: [idpromesa,idTipificacion,monto,fechaPromesa ,autoriza,idinteraccion,cliente,gestor,telefonoContacto ],
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

        if( response[0][0].RESULT == 1 ){
            return res.json({
                status: true,
                info: {
                    msg: 'Se genera promesa con exito'
                },
                data: response[0][0]
            })
        }
        if( response[0][0].RESULT == 2){
            return res.json({
                status: false,
                info: {
                    msg: 'Favor de validar el monto minimo'
                },
                data: response[0][0]
            })
        }
        if( response[0][0].RESULT == 3){
            return res.json({
                status: false,
                info: {
                    msg: 'No puedes editar mas de dos veces una promesa'
                },
                data: response[0][0]
            })
        }
        
        return res.json({
            status: true,
            info: {
                msg: 'Promesa Editada',
            },
            data: response[0][0]
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al editar la promesa'
            },
            data: []
        })
    }


}

module.exports.cancelaPromesa = async (req, res ) => {

    const { idpromesa,autoriza,idinteraccion,cliente,gestor,telefonoContacto,idTipificacion } = req.body
 

    try {
        const sql = `EXEC [SP_CANCELAPROMESA] 
        @IDPROMESA = ? ,
        @AUTORIZA = ? ,
        @IDINTERACCION = ? ,
        @CLIENTE = ? ,
        @GESTOR = ? ,
        @TELEFONO = ?,
        @TIPIFICACION = ? ;`

    
        const response = await db.query(sql, {
            replacements: [ idpromesa,autoriza,idinteraccion,cliente,gestor,telefonoContacto,idTipificacion],
            type: QueryTypes.RAW
        });
        
        
        if( response[0][0].resultado == '1' ){
            return res.json({
                status: true,
                info: {
                    msg: 'Se cancela la promesa'
                },
                data: [response[0][0] ]
            })
        }

        if( response[0][0].resultado == '2' ){
            return res.json({
                status: false,
                info: {
                    msg: 'Ya no puede realizar cancelaciones a este cliente '
                },
                data: [response[0][0] ]
            })
        }
        if( response[0][0].resultado == '3' ){
            return res.json({
                status: false,
                info: {
                    msg: 'Diferente equipo, contacte a su supervisor '
                },
                data: [response[0][0] ]
            })
        }


 
//console.log(response[0][0].resultado);
        return res.json({
            status: true,
            info: {
                msg: 'Se cancelo la promesa',
            },
            data: response
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al editar la promesa'
            },
            data: [error]
        })
    }


}



module.exports.cancelaConvenio = async (req, res ) => {

    const { autoriza,idinteraccion,cliente,gestor,idTipificacion } = req.body
 

    try {
        const sql = `EXEC [SP_CANCELACONVENIOS] 
        @AUTORIZA = ? ,
        @IDINTERACCION = ? ,
        @CLIENTE = ? ,
        @GESTOR = ? ,
        @TIPIFICACION = ? ;`

    
        const response = await db.query(sql, {
            replacements: [ autoriza,idinteraccion,cliente,gestor,idTipificacion],
            type: QueryTypes.RAW
        });
        
        
        if( response[0][0].resultado == '1' ){
            return res.json({
                status: true,
                info: {
                    msg: 'Se cancela la promesa'
                },
                data: [response[0][0] ]
            })
        }

        if( response[0][0].resultado == '2' ){
            return res.json({
                status: false,
                info: {
                    msg: 'Ya no puede realizar cancelaciones a este cliente '
                },
                data: [response[0][0] ]
            })
        }
        if( response[0][0].resultado == '3' ){
            return res.json({
                status: false,
                info: {
                    msg: 'Diferente equipo, contacte a su supervisor '
                },
                data: [response[0][0] ]
            })
        }



 
//console.log(response[0][0].resultado);
return res.json({
    status: true,
    info: {
        msg: 'Se cancelo la promesa',
    },
    data: response
})


} catch (error) {
console.error(error);
return res.json({
    status: false,
    info: {
        msg: 'Hubo un error al editar la promesa'
    },
    data: [error]
})
}


}



module.exports.obtenerAcciones = async ( req , res ) => {

    


}



module.exports.convenio = async (req, res ) => {

    const { idinteraccion,cliente,telefonoContacto,idTipificacion,gestor,montoCalcular, fechaPagoInicial,montoPagoInicial,numeroPagos,detalleConvenio,comentario,tipo } = req.body;
 

    try {
        const sql = `EXEC SP_RegistraConvenio 
        @idinteraccion = ? ,
        @cliente = ? ,
        @telefonoContacto = ? ,
        @idTipificacion = ? ,
        @gestor = ? ,
        @montoCalcular = ? ,
        @fechaPagoInicial = ? ,
        @montoPagoInicial = ? ,
        @numeroPagos = ? ,
        @detalleConvenio = ? ,
        @comentario = ? ,
        @tipo= ? ;`

    
        const response = await db.query(sql, {
            replacements: [idinteraccion,cliente,telefonoContacto,idTipificacion,gestor,montoCalcular, fechaPagoInicial,montoPagoInicial,numeroPagos,detalleConvenio,comentario,tipo ],
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


module.exports.getconvenio = async (req, res ) => {

    const { cliente } = req.params;
 

    try {
        const sql = `EXEC SP_GETCONVENIOS 
        @CLIENTE = ?;`

    
        const response = await db.query(sql, {
            replacements: [cliente],
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
                msg: 'Resultados obtenidos',
            },
            data: response[0][0]
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al recuperar resultados'
            },
            data: []
        })
    }


}


module.exports.registraPago = async (req, res ) => {

    const { idinteraccion,cliente, gestor ,idTipificacion,idPromesa, file_path ,telefonoContacto,tipo,comentario, file_name ,encabezados_archivo } = req.body
  

    try {
    const sql = `EXEC [SP_RegistraPagos] 
    @idinteraccion = ? ,
	@cliente = ? ,
	@gestor = ? ,
	@idTipificacion = ? ,
	@idPromesa = ? ,
	@imagen = ? ,
	@telefonoContacto = ? ,
	@tipo = ? ,
	@comentario = ? ;`

    
        const response = await db.query(sql, {
            replacements: [idinteraccion,cliente, gestor ,idTipificacion,idPromesa, file_path ,telefonoContacto,tipo,comentario, file_name  ,encabezados_archivo ],
            type: QueryTypes.RAW
        });
         

        if( response[0][0]?.error_carga == '1' ){
            return res.json({
                status: false,
                info: {
                    msg: response[0][0].mensaje
                },
                data: response[0][0]
            })
        }
        if( response[0][0].RESULT == 2 ){
            return res.json({
                status: false,
                info: {
                    msg: 'El pago corresponde a una promesa posterior, favor de ajustar la fecha promesada.'
                },
                data: response[0][0]
            })
        }
        if( response[0][0].RESULT == 3 ){
            return res.json({
                status: false,
                info: {
                    msg: 'No puedes subir pagos sobre promesas de otro gestor.'
                },
                data:response[0][0]
            })
        }
        return res.json({
            status: true,
            info: {
                msg: 'El pago se cargo de forma exitosa',
            },
            data: response[0][0]
        })


    } catch (error) {
        
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al generar el pago'
            },
            data: []
        })
    }


}
