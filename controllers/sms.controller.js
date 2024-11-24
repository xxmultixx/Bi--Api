const db = require("../models/index");
const { QueryTypes } = require('sequelize');

module.exports.smsManual = async (req, res) => {

	const { telefono, mensaje } = req.body;

	try {
		const sql = `EXEC SP_ENVIASMSMANUAL 
				@KEY = :key,
				@TELEFONO  = :telefono,
				@MENSAJE = :mensaje`;

		const respuesta = await db.query(sql, {
			replacements: {
				key: telefono,
				telefono: telefono,
				mensaje: mensaje
			}
		});

		return res.json({
            status: true,
            info: {
                msg: 'No se pudo enviar sms'
            },
            data: respuesta
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
                msg: 'No se pudo enviar sms'
            },
            data: []
        });
	}




}

module.exports.smsAltaPlantilla = async (req, res) => {
	const { usuario } = req?.payload;
	const { titulo, mensaje } = req.body;

	try {
		const sql = `EXEC SP_ALTAPLANTILLASMS 
				@TITULO = :titulo,
				@MENSAJE  = :mensaje,
				@CREADOR = :creador`;

		const respuesta = await db.query(sql, {
			replacements: {
				titulo: titulo,
				mensaje: mensaje,
				creador: usuario
			}
		});

		return res.json({
            status: true,
            info: {
                msg: 'Se dio de alta la plantilla'
            },
            data: respuesta
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
                msg: 'No se pudo dar de alta la plantilla'
            },
            data: []
        });
	}




}



module.exports.mensajesRapidos = async (req, res) => {

	const { cliente } = req.params;

	try {
		const sql = `EXEC SP_GETMENSAJESRAPIDOS 
		@CLIENTE = ?`;

		const respuesta = await db.query(sql, {
			replacements: [cliente],
			type: QueryTypes.RAW

		});
		

		return res.json({
            status: true,
            info: {
                msg: 'consulta'
            },
            data: respuesta
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
				msg: 'No se obtenieron plantillas'
            },
            data: []
        });
	}

}


module.exports.smsPlantillas = async (req, res) => {

	const { telefono, mensaje } = req.body;

	try {
		const sql = `EXEC SP_GETPLANTILLASMS `;

		const respuesta = await db.query(sql, {
			
		});

		return res.json({
            status: true,
            info: {
                msg: 'consulta'
            },
            data: respuesta
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
				msg: 'No se obtenieron plantillas'
            },
            data: []
        });
	}




}


module.exports.smsSaldosAgente = async (req, res) => {

	const { filtro } = req.params;

	try {
		const sql = `EXEC SP_GETSALDOSSMS 
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



module.exports.smsValidaEnvioAgente = async (req, res) => {

	const { usuario } = req?.payload;

	try {
		const sql = `EXEC SP_VALIDAPERMISOSSMS
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





module.exports.smsEditaSaldos = async (req, res) => {

	const { usuario } = req?.payload;
	const { gestor, limite,periocidad,opcion } = req.body;

	try {
		const sql = `EXEC SP_SALDOSSMS
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








module.exports.smsEnviaSmsAgente = async (req, res) => {

	const { usuario } = req?.payload;
	const { interaccion,cliente, telefono,mensaje } = req.body;

	try {
		const sql = `EXEC SP_ENVIASMSAGENTE
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







module.exports.smsSaldosGeneral = async (req, res) => {

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



module.exports.smsSaldoAgente = async (req, res) => {

	const { usuario } = req?.payload;

	try {
		const sql = `EXEC SP_GETSALDOSSMSXAGENTE
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


