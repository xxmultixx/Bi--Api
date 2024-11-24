const db = require("../models");
const { QueryTypes } = require('sequelize');

module.exports.validaTelefono = async (req, res) => {

	const { DID } =  req.query;

	try {
		const sql = `EXEC [SP_IDENTIFICADOR] 
        @DID = ?`;

        const response = await db.query(sql, {
            replacements: [DID] 
        });

		return res.json({
            status: true,
            info: {
                msg: 'Ejecucion exitosa'
            },
            data: response
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
                msg: 'Ejecucion fallida'
            },
            data: []
        });
	}




}

