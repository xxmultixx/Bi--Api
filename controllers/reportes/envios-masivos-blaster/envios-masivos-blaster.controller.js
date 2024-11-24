const excel = require("exceljs");

const db = require('../../../models/index');
const db_envios_masivos = require('../../../models/conexion-envios-masivos');

module.exports.obtieneCargas =  async ( req , res ) => {

	try {
		
		const sql = "EXEC SP_OBTIENE_CARGAS @usuario = 'epker' "; 

		const respuesta = await db.query(sql);

		return res.json({
            status: true,
            info: {
                msg: 'Cargas blaster',
            },
            data: respuesta[0]
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


module.exports.agrupadoBlaster =  async ( req , res ) => {

    const { id_carga } = req.params;

	try {
		
		const sql = "EXEC SP_REP_AGRUPADO_BLASTER @IDCARGA =  :id_carga "; 

		const respuesta = await db_envios_masivos.query(sql ,{
            replacements : { id_carga :  id_carga }
        });

		return res.json({
            status: true,
            info: {
                msg: 'Cargas blaster',
            },
            data: respuesta[0]
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


module.exports.detalleBlaster =  async ( req , res ) => {

    const { id_carga } = req.params;

	try {
		
		const sql = "EXEC SP_REP_DETALLE_BLASTER @IDCARGA =  :id_carga "; 

		const respuesta = await db_envios_masivos.query(sql ,{
            replacements : { id_carga :  id_carga }
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Detalle Blaster");
        
        let columns =  Object.keys(respuesta[0][0]).map( encabezado => ({ header: encabezado, key: encabezado })  );

        worksheet.columns = columns ;

        // Add Array Rows
        worksheet.addRows(respuesta[0]);
        // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + `reporte-blaster ${id_carga}.xlsx `
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


module.exports.obtenerLotes =async  ( req , res ) => {
	
	try {
		const sql = `SELECT * from lotes_blaster where activo = 1`;

		const respuesta = await db.query(sql);

		console.log(respuesta);

		return res.json({
            status : true ,
            info : {
                msg : 'Lotes blaster'
            },
            data : respuesta[0]
        })


	} catch (error) {
	
		console.error(error);

		return res.json({
            status : false ,
            info : {
                msg : 'no se pudieron cargar los lotes blaster'
            },
            data : [] 
        })
	
	}
}