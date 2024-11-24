const  { Sequelize }  = require('sequelize');
const db = require('./index');


const Roles = db.define("roles", {
    id_role: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    role: {
        type: Sequelize.STRING(60),
        allowNull : false,
        unique: {   
            args : true ,
            msg : 'Usuario registrado'
        } ,
    },
    status: {
        type: Sequelize.STRING(60),
        defaultValue: 1
    },
});


module.exports =  Roles;