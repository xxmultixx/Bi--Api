const db = require("../../models");
const carteoPlantilla = require("../../models/carteo-pantilla.model");



const getClientesAztecaPDF = async ({ id_plantilla, codigo_postal, colonia, poblacion, estado, gerencia, saldo_total_min, saldo_total_max, atraso_maximo_min, atraso_maximo_max }) => {


    try {
        const sql = `EXEC SP_GENERAR_PDF_AZTECA
                :id_plantilla,
                :codigo_postal ,
                :colonia ,
                :poblacion ,
                :estado ,
                :gerencia ,
                :saldo_total_min ,
                :saldo_total_max ,
                :atraso_maximo_min,
                :atraso_maximo_max`;

        const respuesta = await db.query(sql, {
            replacements: {
                id_plantilla,
                codigo_postal,
                colonia,
                poblacion,
                estado,
                gerencia,
                saldo_total_min,
                saldo_total_max,
                atraso_maximo_min,
                atraso_maximo_max,
            },
            type: db.Sequelize.QueryTypes.SELECT
        });


        const platillas = respuesta.map(registros => registros.plantilla);
        return platillas;

    } catch (error) {

        console.log(error);

    }



}


const getClientesCamePDF = ({ id_plantilla, termino }) => {
    return new Promise(async (resolve, reject) => {

        try {

            
            const tipoPlantilla = await carteoPlantilla.findOne({
                where: { id: id_plantilla },
                attributes: ['nombre']
                
            });
            
            let sql;

            if (tipoPlantilla.nombre === 'Tarjeton_Came') {

                sql = `EXEC SP_GENERAR_PDF_CAME_TARJETON :id_plantilla, :termino`;
                

            } else {
                
                sql = `EXEC SP_GENERAR_PDF_CAME :id_plantilla, :termino`;
            }


            const respuesta = await db.query(sql, {
                replacements: { id_plantilla, termino },
                type: db.Sequelize.QueryTypes.SELECT
            });

            const platillas = respuesta.map(registros => registros.plantilla);
            resolve(platillas);

        } catch (error) {

            console.log(error);
            reject('Error! No se logro cargar los clientes de came con las plantillas HTML')

        }
    })
}



const getClientesCameApoyoPDF = ({ id_plantilla, operacionesId }) => {
    return new Promise(async (resolve, reject) => {

        try {

            const sql = `EXEC SP_GENERAR_PDF_APOYO
                    :id_plantilla,
                    :operacionesId`;

            const respuesta = await db.query(sql, {
                replacements: { id_plantilla, operacionesId },
                type: db.Sequelize.QueryTypes.SELECT
            });

            const platillas = respuesta.map(registros => registros.plantilla);

            resolve(platillas);

        } catch (error) {

            console.log(error);
            reject('Error! No se logro cargar los clientes de apoyo con las plantillas HTML')

        }
    })
}

module.exports = {
    getClientesCameApoyoPDF,
    getClientesAztecaPDF,
    getClientesCamePDF
}