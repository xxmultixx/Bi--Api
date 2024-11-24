const excel = require("exceljs");
const db_envios_masivos = require('../../../models/conexion-envios-masivos');

module.exports.obtenerCargasSms = async (req, res) => {
	try {

		const sql = `EXEC  SP_OBTIENE_CARGAS_SMS @USUARIO = 'EPKER' `;

		const respuesta = await db_envios_masivos.query(sql);

		return res.json({
			status: true,
			info: {
				msg: 'Cargas SMS',
			},
			data: respuesta[0]
		});

	} catch (error) {
		console.error(error);

		return res.json({
			status: false,
			info: {
				msg: 'Cargas SMS',
			},
			data: []
		});
	}
}

module.exports.agrupadoCargaSms = async (req, res) => {

	const { id_carga } = req.params;

	try {

		const sql = `EXEC  SP_REP_AGRUPADO_SMS @IDCARGA = :id_carga `;

		const respuesta = await db_envios_masivos.query(sql, {
			replacements: { id_carga: id_carga }
		});

		return res.json({
			status: true,
			info: {
				msg: 'Cargas SMS',
			},
			data: respuesta[0]
		});

	} catch (error) {
		console.error(error);

		return res.json({
			status: false,
			info: {
				msg: 'Cargas SMS',
			},
			data: []
		});
	}

}

module.exports.detalleCargaSms = async ( req , res ) => {

	const { id_carga } = req.params;

	try {

		const sql = "EXEC SP_REP_DETALLE_SMS @IDCARGA =  :id_carga ";

		const respuesta = await db_envios_masivos.query(sql, {
			replacements: { id_carga: id_carga }
		});

		let workbook = new excel.Workbook();
		let worksheet = workbook.addWorksheet("Detalle SMS");

		let columns = Object.keys(respuesta[0][0]).map(encabezado => ({ header: encabezado, key: encabezado }));

		worksheet.columns = columns;

		// Add Array Rows
		worksheet.addRows(respuesta[0]);
		// res is a Stream object
		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=" + `reporte-SMS ${id_carga}.xlsx `
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



