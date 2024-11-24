const  { Sequelize }  = require('sequelize');
const db = require('./index');
const bcrypt = require('bcrypt-nodejs');


const Usuarios = db.define("usuarios", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING(60),
        allowNull : false
    },
    apellido: {
        type: Sequelize.STRING(60),
        allowNull : false
    },
    usuario: {
        type: Sequelize.STRING(60),
        allowNull : false ,
        unique: {   
            args : true ,
            msg : 'Usuario registrado'
        } ,
    },
    password: {
        type: Sequelize.STRING,
        allowNull : false,
        validate : {
            notEmpty : {
                msg : 'La contraseña no puede ir vacia.'
            }
        }
    },
    idGrupo: {
        type: Sequelize.INTEGER,
    },

    id_role: {
        type: Sequelize.INTEGER,
        // references: {
        //     model: 'roles', // 'fathers' refers to table name
        //     key: 'id_role', // 'id' refers to column name in fathers table
        // }
    },
    activo: {
        type: Sequelize.TINYINT,
        defaultValue: 1
    }
} , {
    hooks : {
        beforeCreate( usuario ){
            usuario.password = bcrypt.hashSync(usuario.password , bcrypt.genSaltSync(10) , null );
        },
        beforeUpdate( usuario ){
            usuario.password = bcrypt.hashSync(usuario.password , bcrypt.genSaltSync(10) , null );
        },
    }
});


Usuarios.prototype.validarPassword = function(password)  {
    return bcrypt.compareSync( password , this.password );
}



module.exports =  Usuarios;