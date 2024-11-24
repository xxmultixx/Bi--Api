const db = require("../models/index");
const { QueryTypes } = require('sequelize');
 


module.exports.blasterSaldosAgente = async (req, res) => {

	const { filtro } = req.params;

	try {
		const sql = `EXEC SP_GETSALDOSBLASTER
		@FILTRO = ?`;

		const respuesta = await db.query(sql, {
			replacements: [filtro],
			type: QueryTypes.RAW

		});

		return res.json({
            status: true,
            info: {
                msg: 'Consulta exitosa'
            },
            data: respuesta[0]
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
				msg: 'No se obtenieron datos'
            },
            data: []
        });
	}




}



module.exports.blasterValidaEnvioAgente = async (req, res) => {

	const { usuario } = req?.payload;

	try {
		const sql = `EXEC SP_VALIDAPERMISOSBLASTER
		@GESTOR = :usuario`;

		const respuesta = await db.query(sql, {
			replacements: {
				usuario: usuario  
			}
		});

		return res.json({
            status: true,
            info: {
                msg: 'Consulta exitosa'
            },
            data: respuesta[0]
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
				msg: 'No se obtenieron datos'
            },
            data: []
        });
	}




}





module.exports.blasterEditaSaldos = async (req, res) => {

	const { usuario } = req?.payload;
	const { gestor, limite,periocidad,opcion } = req.body;

	try {
		const sql = `EXEC SP_SALDOSBLASTER
		@USUARIOCREADOR = :usuario,
		@GESTOR = :gestor,
		@LIMITE = :limite,
		@PERIOCIDAD = :periocidad,
		@OPCION = :opcion`;

		const respuesta = await db.query(sql, {
			replacements: {
				usuario: usuario ,
				gestor: gestor ,
				limite: limite ,
				periocidad: periocidad,
				opcion: opcion  
			}
		});

		return res.json({
            status: true,
            info: {
                msg: 'Consulta exitosa'
            },
            data: respuesta[0]
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
				msg: 'Fail'
            },
            data: []
        });
	}




}








module.exports.blasterEnviaBlasterAgente = async (req, res) => {

	const { usuario } = req?.payload;
	const { interaccion,cliente, telefono,mensaje } = req.body;

	try {
		const sql = `EXEC [SP_ENVIABLASTERAGENTE]
		@IDINTERACCION = :interaccion,
		@ASESOR = :usuario,
		@CLIENTE = :cliente,
		@TELEFONO = :telefono,
		@MENSAJE = :mensaje `;

		const respuesta = await db.query(sql, {
			replacements: {
				usuario: usuario ,
				interaccion: interaccion,
				cliente: cliente ,
				telefono: telefono ,
				mensaje: mensaje 
			}
		});

		return res.json({
            status: true,
            info: {
                msg: 'Consulta exitosa'
            },
            data: respuesta[0]
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
				msg: 'Fail'
            },
            data: []
        });
	}




}







module.exports.blasterSaldosGeneral = async (req, res) => {

	const { telefono, mensaje } = req.body;

	try {
		const sql = `EXEC SP_GETSALDOS `;

		const respuesta = await db.query(sql, {
			
		});

		return res.json({
            status: true,
            info: {
                msg: 'Consulta exitosa'
            },
            data: respuesta[0]
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
				msg: 'No se obtenieron datos'
            },
            data: []
        });
	}




}



module.exports.blasterSaldoAgente = async (req, res) => {

	const { usuario } = req?.payload;

	try {
		const sql = `EXEC [SP_GETSALDOSBLASTERXAGENTE]
		@ASESOR = :usuario  `;

		const respuesta = await db.query(sql, {
			replacements: {
				usuario: usuario 			
			}
		});

		return res.json({
            status: true,
            info: {
                msg: 'Consulta exitosa'
            },
            data: respuesta[0]
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
				msg: 'No se obtenieron datos'
            },
            data: []
        });
	}




}


