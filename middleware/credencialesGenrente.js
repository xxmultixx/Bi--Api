const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/usuarios.model');

require('dotenv').config();

module.exports = async (req, res, next) => {
    // autorizacion headere

    //validar usuario y contraseña
    // validar si es usuario gerente
    // validar si existe token
    // validar si role de usario es 1 = gerente 

    const { usuario, password, estatus } = req.body;
    console.log({ estatus });
    if (estatus === 'completa') {
        next();
    } else {

        const authHeader = req.get('Authorization') || `Bearer ${req.query.token}`;

        console.log("authHeader" + authHeader);
        if (authHeader) {
            try {

                const token = authHeader.split(' ')[1]
                console.log("token" + token);
                revisarToken = jwt.verify(token, process.env.SECRET_WORD);
                console.log("revisarToken" + revisarToken);
                req.payload = revisarToken;
                console.log("revisarToken" + req.payload );
                console.log("revisarToken" + req.payload.role ); 

                if (req.payload.role === 1 || req.payload.role === 3|| req.payload.role === 4) {
                    console.log('siguiente');
                    next();
                } else {
                    
                    
            if (!revisarToken) {
                console.log("!revisarToken");
                res.json({
                    estatus: false,
                    info: {
                        msg: 'Token no valido'
                    },
                    data: []
                })
                next(new Error('Token no valido'));
            
        } else if (usuario && password ) {
            console.log("usuario" + usuario);
            console.log("password" + password);
            const gerente = await Usuarios.findOne({
                where: {
                    [Op.and]:
                    {
                        usuario: usuario,
                        [Op.or]: [
                            { id_role: 1 },
                            { id_role: 3 },
                            { id_role: 4 },
                        ]
                    }
                }
            })

            if (!gerente) {

                res.json({
                    estatus: false,
                    info: {
                        msg: 'No se encontro usuario ' + usuario
                    },
                    data: []
                })

                next(new Error('No se encontro usuario' + gerente));
            }

            if (!bcrypt.compareSync(password, gerente.password)) {
                res.json({
                    estatus: false,
                    info: {
                        msg: 'Contraseña gerente incorrecta'
                    },
                    data: []
                });

                next(new Error('Contraseña gerente incorrecta'));

            } else {
                next();
            }
        }
          
    }
            } catch (error) {
                console.error(error);
                res.json({
                    estatus: false,
                    info: {
                        msg: 'Token no valido'
                    },
                    data: []
                })
                next(new Error('Token no valido'));

            }

    }


    // next();
}

}
