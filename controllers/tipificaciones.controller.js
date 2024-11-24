const Tipificaciones = require("../models/tipificaciones.model");
require('dotenv').config();
process.env.TZ = 'America/Monterrey';

exports.mostrarTipificaciones = async ( req , res ) => {

    const { id_firma } = req.query;

    const  statement = {
        where : {
            activo : 1,
            id_firma : id_firma
        },
        order : [['tipo','DESC'],['codigo_accion_siglas','DESC']]
    }

    try {
        const tipificaciones = await Tipificaciones.findAndCountAll(statement);

        return res.json({
            status : true ,
            info : {
                msg : '',
                total : tipificaciones.count ,
            },
            data : tipificaciones.rows 
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