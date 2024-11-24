const Firma = require("../models/firma.model")

module.exports.obtenerFirmas = async ( req , res ) => {

    try {
        
        const firmas = await  Firma.findAll({
            where : {
                activo : 1 
            }
        });

        return res.json({
            status : true ,
            info : {
                msg : 'Firmas'
            },
            data : firmas

        });

    } catch (error) {
        console.error(error);
        return res.json({
            status : true ,
            info : {
                msg : 'No se pudieron cargar las firmas'
            },
            data :[]
        });


    }

} 