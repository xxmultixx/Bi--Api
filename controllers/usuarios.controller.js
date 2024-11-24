const Usuarios = require('../models/usuarios.model');
const Roles = require('../models/roles.model');
const Grupos = require('../models/grupos.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const db = require("../models");
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');

require('dotenv').config();
process.env.TZ = 'America/Monterrey';
// agrega usuario
exports.nuevoUsuario = async (req, res) => {

    const { nombre , usuario , password ,id_role , apellido , idGrupo  } = req.body;

    const nuevo_usuario = new Usuarios({ nombre , usuario , password , id_role , apellido,idGrupo });

    try {

        await nuevo_usuario.save();

        return res.json({
            status: true,
            info: {
                msg: 'Se creo el nuevo usuario'
            },
            data: nuevo_usuario
        })

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'No se pudo crear el nuevo usuario'
            },
            data: []
        })
    }

}


// mostrar usuarios
exports.mostrarUsuarios = async (req, res) => {

    const { estatus = '' , role = '', page = 1, limit = 15  , nombre = '' , grupo = ''} = req.query;

    try {

        const statement = {
            attributes: ['id', 'nombre', 'apellido', 'usuario', 'id_role', 'activo', 'idGrupo'],
            include : [ 
                { 
                    model : Roles,
                    where : role !== '' ? {
                            id_role : role
                        } : {}
                },
                { 
                    model : Grupos,
                    where : grupo !== '' ? {
                        idGrupo : grupo
                        } : {}
                }

            ],
            where: {
                [Sequelize.Op.and]: [
                    estatus !== '' ? { activo: estatus } : {},
                    {
                        [Sequelize.Op.or]: [
                            { nombre: { [Sequelize.Op.like]: `%${nombre}%` } },
                            { apellido: { [Sequelize.Op.like]: `%${nombre}%` } },
                            { usuario: { [Sequelize.Op.like]: `%${nombre}%` } }
                        ]
                    }
                ]
            },
            order: [['createdAt', 'DESC']]
        };

        const usuarios = await Usuarios.findAndCountAll(statement);

        return res.json({
            status: true,
            info: {
                msg: '',
                total: usuarios.count,
                pages: Math.ceil(usuarios.count / limit),
                current_page: page
            },
            data: usuarios.rows
        })

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: ''
            },
            data: []
        })
        
    }

}

// mostrar gestor
exports.mostrarGestores = async (req, res) => {
 
    const {opcion} = req.params;

    try {
        const sql = `EXEC GET_DROPDOWNSMASIVOS
        @opcion = ?  ;`

    
        const response = await db.query(sql, {
            replacements: [opcion],
            type: QueryTypes.RAW
        });
       
            return res.json({
                status: true,
                info: {
                    msg: 'Consulta exitosa'
                },
                data: response[0]
            })
         
        } catch (error) {
            console.error(error);
            return res.json({
                status: false,
                info: {
                    msg: 'Hubo un error al consultar'
                },
                data: []
            })
        }

}


// mostrar equipos
exports.mostrarEquipos = async (req, res) => {

    const { estatus = '' , role = '', page = 1, limit = 15  , nombre = '' , grupo = ''} = req.query;

    try {
        const grupos = await Grupos.findAndCountAll({
            where: {
                status: 1 // Filtrar por status igual a 1
            }
        });

        return res.json({
            status: true,
            info: {
                msg: '',
                total: grupos.count,
                data: grupos.rows
            },
            
        })

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: ''
            },
            data: []
        })
        
    }

}



// mustra un solo usuario
exports.mostrarUsuario = async (req, res) => {

    // const { id  }

    try {

        const usuarios = await Usuarios.findByid({
            attributes: ['id', 'nombre', 'apellido', 'id_role'],
            //    include : [{
            //        model : Roles ,
            //    }]
        });

        return res.json({
            status: true,
            info: {
                msg: '',
                total: usuarios.length
            },
            data: usuarios
        })

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: ''
            },
            data: []
        })
        
    }

}


//actualizar usuarios
exports.actualizarUsuario = async (req, res) => {

    const { id , nombre , apellido , password , usuario , cambiarGestiones = false , activo = 1 , changePasswordIsChecked = false ,idGrupo} = req.body;

    try {

        const usuario_base = await Usuarios.findByPk(id);
 

        if(!usuario){
            return res.json({
                status: false,
                info: {
                    msg: 'No se encontro usuario'
                },
                data: []
            })
        }

        if( changePasswordIsChecked && password && password.length > 5 ){
            console.log('cambiar');
            usuario_base.password = password;
        }else{
            console.log('no cambiar');
        }

        usuario_base.nombre = nombre;
        usuario_base.usuario = usuario;
        usuario_base.apellido = apellido;
        usuario_base.activo = activo;
        usuario_base.idGrupo = idGrupo;
        await usuario_base.save();

        return res.json({
            status: true,
            info: {
                msg: 'Actualizado',
            },
            data: usuario
        })

    } catch (error) {
        
        console.error(error);

        return res.json({
            status: false,
            info: {
                msg: error?.errors[0]?.message || 'Hubo un error al actualizar el usuario'
            },
            data: []
        })
        
    }

}




// insertar grupo
exports.insertarGrupo = async (req, res) => {
 
    const {nombreGrupo} = req.body;

    try {
        const sql = `EXEC SP_INSERTAGRUPO
        @NOMBREGRUPO = ?  ;`

    
        const response = await db.query(sql, {
            replacements: [nombreGrupo],
            type: QueryTypes.RAW
        });
            return res.json({
                status: true,
                info: {
                    msg: 'Consulta exitosa'
                },
                data: response[0]
            })
         
        } catch (error) {
            console.error(error);
            return res.json({
                status: false,
                info: {
                    msg: 'Hubo un error al consultar'
                },
                data: []
            })
        }

}



// eliimna grupo
exports.eliminaGrupo = async (req, res) => {
 
    const {idGrupo} = req.body;

    try {
        const sql = `EXEC SP_ELIMINAGRUPO
        @IDGRUPO = ? ,
        @USUARIO = ''  ;`

    
        const response = await db.query(sql, {
            replacements: [idGrupo],
            type: QueryTypes.RAW
        });
            return res.json({
                status: true,
                info: {
                    msg: 'Consulta exitosa'
                },
                data: response[0]
            })
         
        } catch (error) {
            console.error(error);
            return res.json({
                status: false,
                info: {
                    msg: 'Hubo un error al consultar'
                },
                data: []
            })
        }

}



// mostrar gestor
exports.obtieneUsuarios = async (req, res) => {
 
    const {opcion} = req.params;

    try {
        const sql = `EXEC SP_GETUSUARIOS;`

    
        const response = await db.query(sql, {
            replacements: [opcion],
            type: QueryTypes.RAW
        });
       
            return res.json({
                status: true,
                info: {
                    msg: 'Consulta exitosa'
                },
                data: response[0]
            })
         
        } catch (error) {
            console.error(error);
            return res.json({
                status: false,
                info: {
                    msg: 'Hubo un error al consultar'
                },
                data: []
            })
        }

}
