const { exitePromesaPago, exiteConvenioActivo } = require("../helpers/validarDB");
const ClientesBancoAzteca = require("../models/clientes-banco-azteca.model");
const Convenio = require("../models/convenios-banco-azteca.model");
const ConvenioPago = require("../models/convenioPago.model");

// const pagos = [
//     {"fecha": "2022-01-27",  "monto": 640,  "num_pago" : 1 },
//     {"fecha": "2022-02-27",  "monto": 640,  "num_pago" : 2 },
//     {"fecha": "2022-03-27",  "monto": 640,  "num_pago" : 3 },
//     {"fecha": "2022-04-27",  "monto": 1280, "num_pago" : 4 }
// ],


/**
 * Obtener todas los convenios
*/
exports.getConvenios = async (req, res) => {

    const { estatus = '' } = req.query;

    const { firma , id_cliente } = req.params;

    try {
        const data = await ConveniosBancoAzteca.findAll({
            include: [
                { model: ConvenioPago, attributes: ['id', 'id_convenio', 'num_pago', 'fecha', 'monto', 'estatus'] },
                { model: ClientesBancoAzteca, attributes: ['nombre_cte'] }
            ],
            where : { 
                cliente_unico : id_cliente
            }
        });

        res.json({ status: true, info: { msg: 'Todos los convenios', total: data.length }, data });
        
        return;

    } catch (error) {

        res.json({ status: false, info: { msg: error }, data: [] });
        return;
    }




}


exports.getConvenioByClienteUnico = async (req, res) => {


    const { cliente_unico } = req.params;

    try {

        const convenio = await exiteConvenioActivo(cliente_unico, true);

        let estatus = convenio ? true : false;
        let msg = convenio ? 'Convenio encontrado' : 'No se encontro convenio.';
        let data = convenio ? [convenio] : [];

        return res.json({ status: estatus, info: { msg }, data });


    } catch (error) {

        res.json({ status: false, info: { msg: error }, data: [] });
        return;
    }



}



exports.nuevoConvenio = async (req, res) => {

    const { pagos, cliente_unico, gestor, codigo_accion, codigo_resultado, telefono, monto, pagos_realizar, tipo_credito, firma ,  comentario = '' } = req.body;
    const data = { cliente_unico, gestor, codigo_accion, codigo_resultado, telefono, monto, pagos_realizar, tipo_credito, comentario }


    // Validar si exite promesa de pago.
    const exitePromesa = await exitePromesaPago({cliente_unico});
    if (exitePromesa) {
        let msg = 'El cliente tiene una promesa de pago en proceso. No le puedes asignar otra';
        res.json({ status: false, info: { msg, promesa_exitente: exitePromesa }, data: [] });
        return;
    }

    const exiteConvenio = await exiteConvenioActivo(cliente_unico);
    if (exiteConvenio) {
        let msg = 'El cliente tiene un convenio en proceso. No le puedes asignar otro';
        res.json({ status: false, info: { msg, convenio_existente: exiteConvenio }, data: [] });
        return;
    }

    try {


        // Crear convenio para obtener el id...
        const newConvenio = new ConveniosBancoAzteca(data);
        const convenio = await newConvenio.save();

        pagos.forEach(async ({ fecha, monto, num_pago }) => {

            try {

                const newFechaPago = new ConvenioPago({ id_convenio: convenio.id, num_pago, fecha, monto });
                await newFechaPago.save();

            } catch (error) {

                let msg = 'Hubo un error al momento de insertar las fechas de pagos';
                res.json({ status: false, info: { msg }, data: [convenio] });
                return;
            }

        });

        // Si todo salio bien...
        return res.json({
            status: true,
            info: {
                msg: 'Convenio creado exitosamente.',
                convenio
            },
            data: []
        });



    } catch (error) {
        console.error(error);
        let msg = 'Hubo un error al momento de crear el convenio';
        res.json({ status: false, info: { msg }, data: [error] });
        return;

    }
}




