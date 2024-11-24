const  { Sequelize }  = require('sequelize');
const db = require('./index');


const LogPromesasCame = db.define("log_promesas_came", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fecha : {
        type : Sequelize.DATE,
        defaultValue : Sequelize.NOW
    },
    id_promesa : {
        type : Sequelize.INTEGER
    },
    id_cliente : {
        type : Sequelize.STRING
    },
    nuevo_status : {
        type : Sequelize.STRING
    },
    usuario : {
        type : Sequelize.STRING  
    }
},{
    freezeTableName: true,
});


module.exports =  LogPromesasCame;