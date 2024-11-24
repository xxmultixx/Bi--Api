const db = require("../../models");
const InteracionesApoyoEconomico = require("../../models/interacciones-apoyo-economico.model");
require('dotenv').config();
process.env.TZ = 'America/Monterrey';

exports.mostrarInteracionesCliente = async ( req , res ) => {
    
    const {operacionesid} = req.params;

    const {  page = 1 , limit = 15  } =  req.query;

    const  statement = {
        where : {
            operacionesid : operacionesid
        },
        offset: parseInt( ( page - 1 ) * limit ), 
        limit: parseInt(limit),
        order : [['id','DESC']]
    }

    try {

        const sql = `SELECT 
        interaciones_apoyo_economico.id_interaccion, interaciones_apoyo_economico.operacionesid,
        interaciones_apoyo_economico.fecha_gestion,interaciones_apoyo_economico.telefono_contacto,
        interaciones_apoyo_economico.tipo_telefono, interaciones_apoyo_economico.gestor,interaciones_apoyo_economico.comentario,
        tipificaciones.codigo_accion,tipificaciones.codigo_accion_siglas,
        tipificaciones.codigo_resultado,tipificaciones.codigo_resultado_siglas
        FROM interaciones_apoyo_economico 
        inner join tipificaciones on tipificaciones.id_tipificacion = interaciones_apoyo_economico.id_tipificacion
        where interaciones_apoyo_economico.operacionesid = :operacionesid 
        order by interaciones_apoyo_economico.fecha_gestion desc`;

        const interaciones = await db.query(sql, {
            replacements: { operacionesid: operacionesid },
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
    
    const interacion = new InteracionesApoyoEconomico(req.body);

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
        console.error(error);
        return res.json({
            status : false ,
            info : {
                msg : 'No se pudo crear el nuevo usuario'
            },
            data : [] 
        })
    }
}

