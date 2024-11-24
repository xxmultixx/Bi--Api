const { check } = require("express-validator");
const Firma = require("../models/firma.model");
const Firmas = require("../models/firma.model");
const PermisosRoles = require("../models/permisos-roles.model");
const Permisos = require("../models/permisos.model");
const Roles = require("../models/roles.model");
const Tipificaciones = require("../models/tipificaciones.model");
const Usuarios = require("../models/usuarios.model");


const initTables = async () => {
    try {
        console.log('aqui se hace');
        const roles = [
            { role: 'Gerente' },
            { role: 'Gestor' }
        ];

        const usuarios = [
            {
                "nombre": "nombre prueba",
                "apellido": "apeliido",
                "usuario": "usuario_gerente",
                "password": "123456789",
                "id_role": 1
            },
            {
                "nombre": "nombre prueba",
                "apellido": "apeliido",
                "usuario": "usuario_gestor",
                "password": "123456789",
                "id_role": 2
            }
        ]

        const permisos = [
            {
                id_permiso: 1,
                nombre: 'Pagos',
                path: '/pagos',
                menu_visible: 1
            },
            {
                id_permiso: 2,
                nombre: 'Promesas',
                path: '/promesas-pago',
                menu_visible: 1
            },
            {
                id_permiso: 3,
                nombre: 'Productividad',
                path: '/productividad',
                menu_visible: 1
            },
            {
                id_permiso: 4,
                nombre: 'Reportes',
                path: '/reportes',
                menu_visible: 1
            },
            {
                id_permiso: 5,
                nombre: 'Asignacion',
                path: '/asignacion',
                menu_visible: 1
            },
            {
                id_permiso: 6,
                nombre: 'Cargas Masivas',
                path: '/cargas-masivas',
                menu_visible: 1
            },
            {
                id_permiso: 7,
                nombre: 'Cartera',
                path: '/cartera',
                menu_visible: 1
            },
            {
                id_permiso: 8,
                nombre: 'Usuarios',
                path: '/usuarios',
                menu_visible: 1
            },
            {
                id_permiso: 9,
                nombre: 'Interacciones',
                path: '/interacciones',
                menu_visible: 0
            },
        ]

        const permisos_roles = [
            { id_role: 1, id_permiso: 1, menu_visible: 1, },
            { id_role: 1, id_permiso: 2, menu_visible: 1, },
            { id_role: 1, id_permiso: 3, menu_visible: 1, },
            { id_role: 1, id_permiso: 4, menu_visible: 1, },
            { id_role: 1, id_permiso: 5, menu_visible: 1, },
            { id_role: 1, id_permiso: 6, menu_visible: 1, },
            { id_role: 1, id_permiso: 7, menu_visible: 1, },
            { id_role: 1, id_permiso: 8, menu_visible: 1, },
            { id_role: 1, id_permiso: 9, menu_visible: 0, },
            // ****************************************************/
            { id_role: 2, id_permiso: 1, menu_visible: 1, },
            { id_role: 2, id_permiso: 2, menu_visible: 1, },
            { id_role: 2, id_permiso: 9, menu_visible: 0, },
        ];

        const tipificaciones = [
            { tipo: "interacion", codigo_accion_siglas: "CC", codigo_accion: "Contacto Cliente", codigo_resultado: "Cuelga", codigo_resultado_siglas: "CU", activo: "1" },
            { tipo: "interacion", codigo_accion_siglas: "CC", codigo_accion: "Contacto Cliente", codigo_resultado: "Posible Promesa", codigo_resultado_siglas: "PM", activo: "1" },
            { tipo: "interacion", codigo_accion_siglas: "CC", codigo_accion: "Contacto Cliente", codigo_resultado: "Posible Promesa", codigo_resultado_siglas: "PM", activo: "1" },
            { tipo: "interacion", codigo_accion_siglas: "CT", codigo_accion: "Contacto Tercero", codigo_resultado: "No vive Ahí", codigo_resultado_siglas: "NV", activo: "1" },
            { tipo: "interacion", codigo_accion_siglas: "CT", codigo_accion: "Contacto Tercero", codigo_resultado: "No lo conoce", codigo_resultado_siglas: "NC", activo: "1" },
        ];

        const firmas = [
            { nombre: 'Banco Azteca' },
            { nombre: 'Camel' },
            { nombre: 'Apoyo Economico' },
        ];

        // firmas.forEach(async (firma) => {
        //     try {
        //         firma_instacia = new Firma(firma);
        //         console.log(firma_instacia);
        //         await firma_instacia.save();

        //     } catch (error) {

        //         console.log('no se hace');
        //         console.error(error);
        //     }
        // })

        roles.forEach(async (role) => {
            try {
                role_instance = new Roles(role);
                console.log(role_instance);
                await role_instance.save();

            } catch (error) {

                console.log('no se hace');
                console.error(error);
            }
        })

        usuarios.forEach(async (user) => {
            try {

                usuario_instance = new Usuarios(user);
                console.log(usuario_instance);
                await usuario_instance.save();

            } catch (error) {

                console.log('no se hace');
                console.error(error);
            }
        })


        permisos.forEach(async (persmiso) => {
            try {

                permiso_instance = new Permisos(persmiso);
                console.log(permiso_instance);

                await permiso_instance.save();

            } catch (error) {

                console.log('no se hace');
                console.error(error);
            }
        })

        permisos_roles.forEach(async (persmiso) => {
            try {

                permisos_role_instance = new PermisosRoles(persmiso);
                console.log(permisos_role_instance);

                await permisos_role_instance.save();

            } catch (error) {

                console.log('no se hace');
                console.error(error);
            }
        })


        tipificaciones.forEach(async (tipificacion) => {
            try {

                tipificacion_instance = new Tipificaciones(tipificacion);
                console.log(tipificacion_instance);

                await tipificacion_instance.save();

            } catch (error) {

                console.log('no se hace');
                console.error(error);
            }
        })


    } catch (error) {
        console.log('no se inico');
    }
}

module.exports = { initTables }