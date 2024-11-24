const { response } =  require('express')
const { validationResult } = require('express-validator')

const validarCampos = ( req , res = response , next ) => {

    const errors =  validationResult( req );
    
    if(!errors.isEmpty()) {

        console.log( errors.errors );

        const texto_error = errors.errors.reduce( (  prevValue , currentValue ) => {
            return prevValue += `
            ${currentValue.msg}` 
        }, `` );

        return res.json({
            status : false ,
            info : {
                msg : texto_error
            },
            data : []
        })

    }

    next();

}

module.exports = { validarCampos };