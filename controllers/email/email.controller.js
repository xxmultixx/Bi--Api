const excel = require("exceljs");
const db_envios_masivos = require("../../models/conexion-envios-masivos");

module.exports.obtenerEmails = async (req, res) => {

	const { usuario } = req.params;

	try {

		const sql = `SELECT 
					ID, 
					format(FECHA_INSERTADO ,'dd-MM-yyyy') as FECHA_INSERTADO,
					NOMBREPLANTILLA,
					MENSAJE,
					USUARIO,
					ESTATUS,
					[CODIGO HTML]
					FROM TB_MENSAJES_EMAIL where USUARIO = :usuario`;

		const respuesta = await db_envios_masivos.query(sql, {
			replacements: { usuario: usuario }
		});

		return res.json({
			status: true,
			info: {
				msg: 'Email'
			},
			data: respuesta[0]
		})

	} catch (error) {
		console.error(error);

		return res.json({
			status: false,
			info: {
				msg: 'Hubo un error al cargar los emails'
			},
			data: []
		})

	}

}


module.exports.obtenerCargasEmail = async (req, res) => {
	try {

		const sql = `EXEC  SP_OBTIENE_CARGAS_EMAIL @USUARIO = 'EPKER' `;

		const respuesta = await db_envios_masivos.query(sql);

		return res.json({
			status: true,
			info: {
				msg: 'Cargas Email',
			},
			data: respuesta[0]
		});

	} catch (error) {
		console.error(error);

		return res.json({
			status: false,
			info: {
				msg: 'Cargas Email',
			},
			data: respuesta[0]
		});
	}
}



module.exports.agrupadoCargaEmail = async (req, res) => {

	const { id_carga } = req.params;

	try {

		const sql = `EXEC  SP_REP_AGRUPADO_EMAIL @IDCARGA = :id_carga `;

		const respuesta = await db_envios_masivos.query(sql, {
			replacements: { id_carga: id_carga }
		});

		return res.json({
			status: true,
			info: {
				msg: 'Cargas Email',
			},
			data: respuesta[0]
		});

	} catch (error) {
		console.error(error);

		return res.json({
			status: false,
			info: {
				msg: 'Cargas Email',
			},
			data: respuesta[0]
		});
	}

}

module.exports.detalleCargaEmail = async ( req , res ) => {

	const { id_carga } = req.params;

	try {

		const sql = "EXEC SP_REP_DETALLE_EMAIL @IDCARGA =  :id_carga ";

		const respuesta = await db_envios_masivos.query(sql, {
			replacements: { id_carga: id_carga }
		});

		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Detalle Email");

		let columns = Object.keys(respuesta[0][0]).map(encabezado => ({ header: encabezado, key: encabezado }));

		worksheet.columns = columns;

		console.log(respuesta);

		// Add Array Rows
		worksheet.addRows(respuesta[0]);
		// res is a Stream object
		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=" + `reporte-Email ${id_carga}.xlsx `
		);
		return workbook.xlsx.write(res).then(function () {
			res.status(200).end();
		});

	} catch (error) {

		console.error(error);

		return res.json({
			status: false,
			info: {
				msg: 'No se pudo cargar la información.',
			},
			data: []
		});

	}
}