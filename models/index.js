// const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
require('dotenv').config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mssql',
    // port : process.env.DB_PORT,
    pool: {
        max: 5,
        min: 0,
        acquire: 300000,
        idle: 3000000
    },
    // logging: false
    
    cryptoCredentialsDetails : {
        minVersion:'TLSv1'
    },
    options: {
        encrypt: false,
        enableArithAbort: false,
        connectionTimeout: 3000000, // 30 segundos
        requestTimeout: 3000000 ,// 1 minuto
        // useUTC: false, // for reading from database
        // timezone: "America/Mexico_city"
        cryptoCredentialsDetails: {
			minVersion: 'TLSv1'
		},
    },
    dialectOptions: {
        encrypt: true,
        useUTC: false, // for reading from database
        // timezone: "America/Mexico_city"
        connectionTimeout: 3000000, // 30 segundos
        requestTimeout: 3000000 ,// 1 minuto
        cryptoCredentialsDetails: {
			minVersion: 'TLSv1'
		},
        options: {
            enableArithAbort: false,
            cryptoCredentialsDetails: {
                minVersion: 'TLSv1'
            },
            connectionTimeout: 3000000, // 30 segundos
            requestTimeout: 3000000 ,// 1 minuto
        }
    },
    // useUTC: false, 
    timezone: "America/Mexico_city",
    requestTimeout: 3000000
});

module.exports = db;