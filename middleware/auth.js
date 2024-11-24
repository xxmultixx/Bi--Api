const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = ( req, res, next ) => {
    // autorizacion headere
    const authHeader = req.get('Authorization') || `Bearer ${req.query.token}` ;

    if( !authHeader ){
        return res.status(401).json({
            estatus : false ,
            info : {
                msg : 'No se envio el token'
            },
            data : []
        }) 
    }

    try {
        
        const token = authHeader.split(' ')[1]

        revisarToken =  jwt.verify(token , process.env.SECRET_WORD);

        req.payload = revisarToken;

    } catch (error) {
        
        return res.status(401).json({
            estatus : false ,
            info : {
                msg : 'Token no valido'
            },
            data : []
        })
        
    }

    if(!revisarToken){
        return res.status(401).json({
            estatus : false ,
            info : {
                msg : 'No autenticado'
            },
            data : []
        })
    }

    next();
}


