const db = require("../models");
const Interaciones = require("../models/interaciones.model");
require('dotenv').config();
process.env.TZ = 'America/Monterrey';

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


module.exports.obtenerAcciones = async ( req , res ) => {

    


}