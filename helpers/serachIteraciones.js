const moment = require('moment');
const { Op, fn, col, literal } = require('sequelize');
const Tipificaciones = require("../models/tipificaciones.model");
const Interaciones = require("../models/interaciones.model");
const ClientesBancoAzteca = require('../models/clientes-banco-azteca.model');
const InteracionesCame = require('../models/interacciones-came.model');
const ClientesCamel = require('../models/clientes-camel.model');
const clientesApoyoEconomico = require('../models/clientes-apoyo-economico.model');
const InteracionesApoyoEconomico = require('../models/interacciones-apoyo-economico.model');

const getIteracionesBancoAzteca = async ({ page, limit, fecha_inicio, fecha_limite, tipificacion, reporte = false }) => {


    try {

        const newFechaInicio = moment(fecha_inicio).subtract(1, 'd').format('YYYY-MM-DD');
        const newfechaLimite = moment(fecha_limite).add(1, 'd').format('YYYY-MM-DD');
        // console.log({ newFechaInicio, newfechaLimite });

        const rulesFind = {
            where: {
                fecha_gestion: {
                    [Op.between]: [
                        newFechaInicio,
                        newfechaLimite
                        // fecha_inicio,
                        // fecha_limite
                    ]
                }
            },
            include: [
                {
                    model: Tipificaciones,
                    attributes: ['codigo_accion', 'codigo_resultado', 'codigo_resultado_siglas']

                },
                {
                    model: ClientesBancoAzteca,
                    as: 'cliente',
                    attributes: [['nombre_cte', 'nombre'],'gerencia']

                }
            ],
            attributes: [
                'id',
                ['cliente_unico', 'cliente_id'],
                [literal("'banco azteca'"), 'firma'],
                [fn('format', col("fecha_gestion"), 'yyyy-MM-dd'), 'fecha_gestion'],
                'id_interaccion',
                'id_tarea',
                'gestor',
                'telefono_contacto',
                
            ],
            offset: parseInt((page - 1) * limit),
            limit: parseInt(limit),
            order: [['id', 'DESC']],
        }

        // Aplanar los registros para los pdf
        if (reporte) {
            rulesFind.raw = true;
        }

        // Si se buscar por tipificacion
        if (tipificacion !== '') {
            rulesFind.where.id_tipificacion = tipificacion;
        }


        const tipificaciones = await Interaciones.findAndCountAll(rulesFind);
        return tipificaciones;

    } catch (error) {

        console.log(error);

    }


}


const getIteracionesCame = async ({ page, limit, fecha_inicio, fecha_limite, tipificacion, reporte = false }) => {
    try {
        const newFechaInicio = moment(fecha_inicio).subtract(1, 'd').format('YYYY-MM-DD');
        const newfechaLimite = moment(fecha_limite).add(1, 'd').format('YYYY-MM-DD');

        const rulesFind = {
            where: {
                fecha_gestion: {
                    [Op.between]: [
                        newFechaInicio,
                        newfechaLimite
                        // fecha_inicio,
                        // fecha_limite
                    ]
                }
            },
            include: [
                {
                    model: Tipificaciones,
                    attributes: ['codigo_accion', 'codigo_resultado', 'codigo_resultado_siglas']

                },
                {
                    model: ClientesCamel,
                    as: 'cliente',
                    attributes: [['nombre_socio', 'nombre']]

                }
            ],
            attributes: [
                'id',
                ['id_socio', 'cliente_id'],
                [fn('format', col("fecha_gestion"), 'yyyy-MM-dd'), 'fecha_gestion'],
                [literal("'came'"), 'firma'],
                'id_interaccion',
                'id_tarea',
                'gestor',
                'telefono_contacto',
            ],
            offset: parseInt((page - 1) * limit),
            limit: parseInt(limit),
            order: [['id', 'DESC']],
        }


        if (reporte) {
            rulesFind.raw = true;
        }

        // Si se buscar por tipificacion
        if (tipificacion !== '') {
            rulesFind.where.id_tipificacion = tipificacion;
        }


        const tipificaciones = await InteracionesCame.findAndCountAll(rulesFind);
        return tipificaciones;

    } catch (error) {

        console.log(error);

    }


}



const getIteracionesApoyoEconomico = async ({ page, limit, fecha_inicio, fecha_limite, tipificacion, reporte = false }) => {

    try {

        const newFechaInicio = moment(fecha_inicio).subtract(1, 'd').format('YYYY-MM-DD');
        const newfechaLimite = moment(fecha_limite).add(1, 'd').format('YYYY-MM-DD');

        const rulesFind = {
            where: {
                fecha_gestion: {
                    [Op.between]: [
                        newFechaInicio,
                        newfechaLimite
                        // fecha_inicio,
                        // fecha_limite
                    ]
                }
            },
            include: [
                {
                    model: Tipificaciones,
                    attributes: ['codigo_accion', 'codigo_resultado', 'codigo_resultado_siglas']

                },
                {
                    model: clientesApoyoEconomico,
                    as: 'cliente',
                    attributes: [['nombre_cte', 'nombre']]

                }
            ],
            attributes: [
                'id',
                ['operacionesid', 'cliente_id'],
                [fn('format', col("fecha_gestion"), 'yyyy-MM-dd'), 'fecha_gestion'],
                [literal("'Apoyo Economico'"), 'firma'],
                'id_interaccion',
                'id_tarea',
                'gestor',
                'telefono_contacto',
            ],
            offset: parseInt((page - 1) * limit),
            limit: parseInt(limit),
            order: [['id', 'DESC']],
        }


        // Aplana los registros para hacer los reportes
        if (reporte) {
            rulesFind.raw = true;
        }

        // Si se buscar por tipificacion
        if (tipificacion !== '') {
            rulesFind.where.id_tipificacion = tipificacion;
        }




        const tipificaciones = await InteracionesApoyoEconomico.findAndCountAll(rulesFind);
        return tipificaciones;

    } catch (error) {

        console.log(error);
        throw new 'Error al traer la interacciones de apoyo ecomico';
    }


}


module.exports = {
    getIteracionesApoyoEconomico,
    getIteracionesBancoAzteca,
    getIteracionesCame,
}