const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const { generarJWT } = require('../helpers/jwt');
const Usuarios = require("../models/usuarios.model");
require('dotenv').config();
process.env.TZ = 'America/Monterrey';

exports.autenticarUsuario = async (req, res, next) => {

    const { usuario, password } = req.body;

    try {
        // buscar usuario
        const usuario_db = await Usuarios.findOne({ where: { usuario: usuario, activo: 1 } });

        if (!usuario_db) {
             return res.status(401).json({
                estatus: false,
                info: {
                    msg: 'Usuario no existe'
                },
                data: []
            });

        } else {
            //verifica password
            if (!bcrypt.compareSync(password, usuario_db.password)) {
                 return res.status(401).json({
                    estatus: false,
                    info: {
                        msg: 'Contraseña incorrecta'
                    },
                    data: []
                });

            } else {
                //password correcto

                const payload = {
                    _id: usuario_db.id,
                    usuario: usuario_db.usuario,
                    role: usuario_db.id_role,
                    nombre: usuario_db.nombre,
                    apellido: usuario_db.apellido
                }

                const token = await generarJWT({ payload: payload });


                return res.json({
                    status: true,
                    data: {
                        token: token,
                        info_usuario: {
                            usuario: usuario_db.usuario,
                            role: usuario_db.id_role,
                            nombre: usuario_db.nombre,
                            apellido: usuario_db.apellido
                        }
                    }
                })
            }
        }

    } catch (error) {
        console.error(error);
         return res.status(401).json({
            estatus: false,
            info: {
                msg: 'No se pudo autenticar usuario'
            },
            data: []
        });

    }

}


exports.revalidarToken = async (req, res) => {

    const { payload } = req;

    try {

        const token = await generarJWT({ payload });

        return res.json({
            estatus: true,
            info: {
                msg: 'Nuevo token'
            },
            data: {
                token
            }
        });

    } catch (error) {
        return res.json({
            estatus: true,
            info: {
                msg: 'No se pudo generar token'
            },
            data: {
                
            }
        });
    }

}