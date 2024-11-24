const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const db = require('../models');
const DetallePermisos = require('../models/detalles-permisos.model');
const PermisosRoles = require('../models/permisos-roles.model');
const Permisos = require('../models/permisos.model');
const Roles = require('../models/roles.model');
const Usuarios = require('../models/usuarios.model');
const { Op } = Sequelize;
require('dotenv').config();
process.env.TZ = 'America/Monterrey';

exports.mostrarMenu = async (req, res) => {

    const { _id, role, usuario } = req.payload;

    console.log({ _id, role });

    try {


        const menu = await Permisos.findAll({
            where: { [Op.and]: [{ activo: 1 }, { menu_visible: 1 }] },
            order: [['orden', 'asc']],
            include: [
                {
                    model: DetallePermisos,
                    where: { activo: 1 },
                    required: false
                },
                {
                    model: PermisosRoles,
                    attributes: ['id'],
                    where: { menu_visible: 1 },
                    include: [
                        {
                            model: Roles,
                            where: {
                                [Op.and]: [
                                    { id_role: role },
                                    { status: 1 },
                                ]
                            },
                            attributes: ['id_role'],
                            include: [
                                {
                                    model: Usuarios,
                                    attributes: ['id'],
                                    where: {
                                        [Op.and]: [
                                            { id: _id },
                                            { activo: 1 }
                                        ]
                                    }
                                }
                            ]
                        },
                    ]
                }
            ]
        });

        return res.json({
            estatus: true,
            info: {
                msg: 'permisos'
            },
            data: menu
        });

    } catch (error) {
        console.error(error);
        return res.json({
            estatus: false,
            info: {
                msg: 'error'
            },
            data: []
        })
    }

}