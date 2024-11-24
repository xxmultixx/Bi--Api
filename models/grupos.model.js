const  { Sequelize }  = require('sequelize');
const db = require('./index');


const Grupos = db.define("grupos", {
    idGrupo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    grupo: {
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


module.exports =  Grupos;