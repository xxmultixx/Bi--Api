const db = require("../../models");
const { QueryTypes } = require('sequelize');




const getFiltrosClienteAzteca = async (codigo_postal) => {
    return new Promise(async (resolve, reject) => {

        const colonia = `SELECT DISTINCT LOWER(colonia_cte) AS colonia FROM clientes_banco_azteca WHERE cp_cte = :cp`
        const poblacion = `SELECT DISTINCT lower(CONVERT(VARCHAR, poblacion_cte)) AS poblacion FROM clientes_banco_azteca  WHERE cp_cte = :cp`
        const estado = `SELECT DISTINCT lower(CONVERT(VARCHAR, estado_cte)) AS estado FROM clientes_banco_azteca where cp_cte = :cp`
        const gerencia = `SELECT DISTINCT lower(CONVERT(VARCHAR, gerencia)) AS gerencia FROM clientes_banco_azteca where cp_cte = :cp`

        try {

            const querys = [
                db.query(colonia, { replacements: { cp: codigo_postal }, type: QueryTypes.SELECT }),
                db.query(poblacion, { replacements: { cp: codigo_postal }, type: QueryTypes.SELECT }),
                db.query(estado, { replacements: { cp: codigo_postal }, type: QueryTypes.SELECT }),
                db.query(gerencia, { replacements: { cp: codigo_postal }, type: QueryTypes.SELECT }),
            ];


            const data = await Promise.all(querys);
            resolve(data);

        } catch (error) {

            console.log(error);
            reject('Error! No se logro cargar la informacion para el filtrado de banco Azteca')
        }

    });



}










module.exports = {
    getFiltrosClienteAzteca
}