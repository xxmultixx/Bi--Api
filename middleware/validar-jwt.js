const  { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res  = response, next ) => {
    
    const authHeader = req.get('x-token');

    console.log({authHeader});
    
    next();

}

module.exports = { validarJWT}