const db = require("../../models");
const InteracionesCame = require("../../models/interacciones-came.model");
const Interaciones = require("../../models/interaciones.model");
require('dotenv').config();
process.env.TZ = 'America/Monterrey';

exports.mostrarInteracionesCliente = async ( req , res ) => {
    
    const {id_socio} = req.params;

    const {  page = 1 , limit = 15  } =  req.query;

    const  statement = {
        where : {
            id_socio : id_socio
        },
        offset: parseInt( ( page - 1 ) * limit ), 
        limit: parseInt(limit),
        order : [['id','DESC']]
    }

    try {

        const sql = `SELECT 
        interaciones_came.id_interaccion, interaciones_came.id_socio,
        interaciones_came.fecha_gestion,interaciones_came.telefono_contacto,
        interaciones_came.tipo_telefono, interaciones_came.gestor,interaciones_came.comentario,
        tipificaciones.codigo_accion,tipificaciones.codigo_accion_siglas,
        tipificaciones.codigo_resultado,tipificaciones.codigo_resultado_siglas
        FROM interaciones_came 
        inner join tipificaciones on tipificaciones.id_tipificacion = interaciones_came.id_tipificacion
        where interaciones_came.id_socio = :id_socio 
        order by interaciones_came.fecha_gestion desc`;

        const interaciones = await db.query(sql, {
            replacements: { id_socio: id_socio },
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
    
    const interacion = new InteracionesCame(req.body);

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

