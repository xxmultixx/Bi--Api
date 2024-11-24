const db = require("../models");
const Sequelize = require('sequelize');
const PagosSinPromesa = require("../models/pago-sin-promesa.model");
const Pagos = require("../models/pagos.model");
const PromesasPago = require("../models/promesas-pago.model");
require('dotenv').config();
process.env.TZ = 'America/Monterrey';

exports.mostrarPagosCliente = async (req, res) => {

    const { cliente_unico } = req.params;

    const { page = 1, limit = 15 } = req.query;

    try {

        const pagos = await Pagos.findAndCountAll({
            where: {
                cliente_unico: cliente_unico
            },
            attributes: [
                id_interaccion,
                cliente_unico,
                fecha_gestion,
                gestor,
                tipo_pago,
                id_promesa,
                tipo_contacto,
                monto,
                comentario,
                tipo,
                createdAt,
                updatedAt,
                id_firma,
                [Sequelize.fn('format', Sequelize.col('fecha_pago'), 'yyyy-MM-dd'), 'fecha_pago']
            ],
            offset: parseInt((page - 1) * limit),
            limit: parseInt(limit),
            order: [[sequelize.literal('fecha_gestion'), 'DESC']]
        });

        // console.log({pagos:pagos.rows});

        return res.json({
            status: true,
            info: {
                msg: '',
                total: pagos.count,
                pages: Math.ceil(pagos.count / limit),
                current_page: page
            },
            data: pagos.rows
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


exports.nuevoPago = async (req, res) => {

    const response = {
        status: true,
        info: {
            msg: 'Se agrego la el pago con éxito'
        },
        data: []
    };

    // Obtener la informacion necesaria de la reques y crear el objeto
    const { id_interaccion, cliente_unico, fecha_gestion, gestor, fecha_pago, tipo_pago, tipo_contacto, monto, telefono_contacto ,comentario = '', tipo = '',  id_firma } = req.body;
    const data = {
        id_interaccion,
        cliente_unico,
        fecha_gestion,
        gestor,
        fecha_pago,
        tipo_pago,
        tipo_contacto,
        monto,
        comentario,
        tipo,
        id_firma,
        telefono_contacto
    }

    let isValid;
    let estatus;
    // Buscar si exite promesa de pago
    const promesa = await PromesasPago.findOne({
        attributes: [
            'id_promesa', 'cliente_unico',
            [Sequelize.fn('format', Sequelize.col('fecha_gestion'), 'yyyy-MM-dd'), 'fecha_gestion'],
            [Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa']
        ],
        where: {
            'cliente_unico': cliente_unico,
            'estatus': 'proceso'
        }
    });

    if (promesa) {

        // Validar la fecha de pago.
        const esMayor_o_Igual = Number(new Date(fecha_pago)) <= Number(new Date(promesa.fecha_promesa));
        const esMenor_o_Igual = Number(new Date(fecha_pago)) >= Number(new Date(promesa.fecha_gestion));

        // esMayor_o_Igual && esMenor_o_Igual
        isValid = (esMayor_o_Igual) ? true : false;

        exiteRegistro = true;
        data.id_promesa = promesa.id_promesa;

    } else {
        // Insertar en pago sin promesa.
        isValid = false;
        data.id_promesa = null;

    }

    // si el pago esta dentro del rango de fechas de la promesa
    if (isValid) {

        //* Insertar en pagos
        try {

            const pago = new Pagos(data);
            await pago.save();
            estatus = 'completa';
            response.info.msg = 'El pago se guardo de manera correcta.'
        } catch (error) {

            console.error(error);
            response.status = false;
            response.info.msg = 'No se logro guardar el pago/promesaCompleta.';
            return res.json(response);
        }

    } else {

        try {
            //* Insertar en pagos sin promesa
            estatus = 'sin promesa';

            const pagoSinPromesa =  new PagosSinPromesa(data);

            await pagoSinPromesa.save();

            response.status = true;
            response.info.msg = 'El pago se guardo sin promesa';
        } catch (error) {
            estatus = 'sin promesa';
            response.status = true;
            response.info.msg = 'No se pudo guardar pago';
        }
    }

    // Actulizar si hay una promesa abierta
    if (promesa) {

        try {
            if ( estatus !== 'sin promesa' ){
                await PromesasPago.update({ estatus }, {
                    where: {
                        id_promesa: promesa.id_promesa
                    }
                });
            }

        } catch (error) {

            console.error(error);
            response.status = false;
            response.info.msg = 'Algo salio mal al momento de actulizar';
        }
    }

    return res.json(response);
}


module.exports.mostrarPagosCompletos = async (req, res) => {

    const { page = 1, limit = 15, cliente } = req.query;

    try {

        const pagos = await Pagos.findAndCountAll({
            where: {
                'cliente_unico': cliente
            },
            attributes: [
                'cliente_unico',
                'fecha_gestion',
                'gestor',
                'tipo_pago',
                'id_promesa',
                'tipo_contacto',
                'monto',
                'comentario',
                'tipo',
                'createdAt',
                'updatedAt',
                'id_firma',
                [Sequelize.fn('format', Sequelize.col('fecha_pago'), 'yyyy-MM-dd'), 'fecha_pago']
            ],
            order: [['fecha_gestion', 'DESC']]
        });

        const sql =  `select 
        id,
        id_interaccion,
        cliente_unico,
        fecha_gestion,
        gestor,
        format(fecha_pago , 'yyyy-MM-dd') as fecha_pago, 
        tipo_pago,
        id_promesa,
        tipo_contacto,
        monto,
        comentario,
        tipo,
        createdAt,
        updatedAt,
        id_firma,
        tabla,
        telefono_contacto
        from 
        (  
            select * , tabla = 'Pago Promesa' from pagos  where cliente_unico = :cliente1 
            union all
            select * , tabla = 'Sin Promesa' from pagosSinPromesas where cliente_unico = :cliente2 
        ) as pagos_completa
        order by fecha_gestion desc`;
        
        const pagos_query = await await db.query(sql, {
            replacements: { cliente1: cliente , cliente2: cliente },
        });

        

        return res.json({
            status: true,
            info: {
                msg: 'Pagos',
            },
            data: pagos_query[0]
        });


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'No se pudieron cargar los pagos'
            },
            data: []
        })
    }

}