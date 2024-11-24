const db = require('../models/index');

const validarPromesasPagoCron = async () => {
	try {
		const sql = 'EXEC actualizar_promesa_pago'

		const result = await db.query(sql);

		console.log(result);

	} catch (error) {
		console.error(error);
	}
}


module.exports = validarPromesasPagoCron;