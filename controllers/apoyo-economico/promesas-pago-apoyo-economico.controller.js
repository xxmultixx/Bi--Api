const Sequelize = require("sequelize");
const PagosApoyoEconomico = require("../../models/pagos-apoyo-economico.model");
const PromesasPagoApoyoEconomico = require("../../models/promesas-pago-apoyo-economico.model");
const { exitePromesaPago } = require("../../helpers/validarDB");
const Tipificaciones = require("../../models/tipificaciones.model");
const LogPromesasApoyoEconomico = require("../../models/log-promesas-apoyo_economico.model");
require('dotenv').config();
process.env.TZ = 'America/Monterrey';

exports.mostrarPromesas = async (req, res) => {
    const params = req.params;

    const { operacionesid } = params;

    const { page = 1, limit = 15 } = req.query;

    try {

        const promesas_pago = await PromesasPagoApoyoEconomico.findAndCountAll({
            where: {
                operacionesid: operacionesid
            },
            attributes: [
                'operacionesid',
                'id_promesa',
                'id_interaccion',
                'telefono_contacto',
                'tipo_telefono',
                'id_tipificacion',
                'gestor',
                'estatus',
                'monto',
                'comentario',
                'tipo',
                'fecha_gestion',
                [Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa']
            ],
            include: [
                { model: Tipificaciones },
                { model: PagosApoyoEconomico },
                { 
                    model : LogPromesasApoyoEconomico,
                    as : 'log_promesa'
                }
            ],
            offset: parseInt((page - 1) * limit),
            limit: parseInt(limit),
            order: [['fecha_gestion', 'DESC'],['fecha_promesa','asc']]
        });
        // console.log(promesas_pago.rows);

        return res.json({
            status: true,
            info: {
                msg: '',
                total: promesas_pago.count,
                pages: Math.ceil(promesas_pago.count / limit),
                current_page: page
            },
            data: promesas_pago.rows
        });

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: ''
            },
            data: []
        })
    }
}

module.exports.obtenerPromesa = async (req, res) => {

    const params = req.params;

    const { id_promesa } = params;

    try {

        const promesa_pago = await PromesasPagoApoyoEconomico.findOne({
            where: {
                id_promesa: id_promesa
            },
            attributes: [
                'operacionesid',
                'id_promesa',
                'id_interaccion',
                'telefono_contacto',
                'tipo_telefono',
                'id_tipificacion',
                'gestor',
                'estatus',
                'monto',
                'comentario',
                'tipo',
                'fecha_gestion',
                [Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa']
            ],
            include: [
                { model: Tipificaciones },
                { model: PagosApoyoEconomico }
            ]
        });

        return res.json({
            status: true,
            info: {
                msg: 'Obtener Promesa',
            },
            data: promesa_pago
        });

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'No se pudo cargar la promesa'
            },
            data: []
        })
    }

}


exports.nuevaPromesaPago = async (req, res) => {

    // Obtener solamente la data necesesaria de la request.
    const {
        id_interaccion,
        operacionesid,
        fecha_gestion,
        telefono_contacto,
        tipo_telefono,
        id_tipificacion,
        gestor,
        fecha_promesa,
        monto,
        comentario = '',
        tipo = '',
        id_firma
    } = req.body;


    try {

        const exitePromesa = await exitePromesaPago({ cliente_unico: operacionesid , firma : 'apoyo_economico' });
        if (exitePromesa) {
            return res.json({
                status: false,
                info: {
                    msg: 'El cliente tiene una promesa de pago en proceso. No le puedes asignar otra'
                },
                data: [exitePromesa]
            })
        }



        const promesa_pago = new PromesasPagoApoyoEconomico({
            id_interaccion, operacionesid,
            fecha_gestion, telefono_contacto,
            tipo_telefono, id_tipificacion,
            gestor, fecha_promesa,
            monto, comentario, tipo, id_firma
        });

        await promesa_pago.save();

        return res.json({
            status: true,
            info: {
                msg: 'Se agrego la interacción con éxito'
            },
            data: []
        })

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'No se guardar promesa de pago.'
            },
            data: []
        })

    }
}



module.exports.actualizar_promesa = async (req, res) => {

    const { estatus, id_promesa, id_interaccion, operacionesid, fecha_gestion, gestor, fecha_pago, tipo_pago, tipo_contacto, monto, comentario = '', tipo = '', id_firma } = req.body

    const data_pago = {
        id_interaccion,
        operacionesid,
        fecha_gestion,
        gestor,
        fecha_pago,
        tipo_pago,
        tipo_contacto,
        monto,
        comentario,
        tipo,
        id_firma,
        id_promesa
    }

    const promesa = await PromesasPagoApoyoEconomico.findOne({
        where: { id_promesa: id_promesa }
    });

    try {


        if (!promesa) {
            return res.json({
                estatus: false,
                info: {
                    msg: 'No se encontro promesa'
                },
                data: []
            })
        }
    } catch (error) {
        return res.json({
            estatus: false,
            info: {
                msg: 'No se encontro promesa'
            },
            data: []
        })
    }

    try {
        if (estatus === 'rota') {

            promesa.estatus = 'rota';
            await promesa.save();

            try {

                const log_promesa =  new LogPromesasApoyoEconomico({
                    id_promesa : id_promesa ,
                    id_cliente : promesa.operacionesid ,
                    usuario : req?.body?.usuario || req?.payload?.usuario,
                    nuevo_status :'rota'
                })
                
                log_promesa.save();
                
            } catch (error) {
                console.error(error);
            }

            return res.json({
                estatus: true,
                info: {
                    msg: 'Promesa actualizada'
                },
                data: []
            })

            
        }
    } catch (error) {
        console.error(error);
        return res.json({
            estatus: false,
            info: {
                msg: 'No se pudo actualizar promesaaa'
            },
            data: []
        })
    }

    try {

        const pago = new PagosApoyoEconomico(data_pago);

        if (pago) {
            await pago.save();

            promesa.estatus = "completa";

            await promesa.save();


            return res.json({
                estatus: true,
                info: {
                    msg: 'La promesa se actualizó de manera correcta'
                },
                data: []
            })

        } else {
            return res.json({
                estatus: false,
                info: {
                    msg: 'No se pudo actualizar promesaaa'
                },
                data: []
            })
        }
    } catch (error) {
        console.error(error);
        return res.json({
            estatus: false,
            info: {
                msg: 'No se pudo actualizar promesaaa'
            },
            data: []
        })
    }
}