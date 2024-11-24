const { Op } = require("sequelize");
const buscarClienteIn = require("../helpers/buscarClienteIn");
const { searchClientesByKeyOrDnis } = require("../helpers/search-clientes");
const ClientesBancoAzteca = require("../models/clientes-banco-azteca.model");
const db = require("../models");
const { QueryTypes } = require('sequelize');
require('dotenv').config();
process.env.TZ = 'America/Monterrey';


module.exports.filtroGestionManual = async (req, res) => {
    const {
        firma = '',
        productoCliente = '',
        activos = 1,
        producto = '',
        dictaminacion = '',
        ultimaGestion = '',
        saldoMin = '',
        saldoMax = '',
        fechaGestion = '',
        cpCte = '',
        coloniaCte = '',
        poblacionCte = '',
        estadoCte = '',
        territorio = '',
        territorial = '',
        zona = '',
        zonal = '',
        nombreDespacho = '',
        gerencia = ''
    } = req.body;

    try {
        const sql = `EXEC SP_FILTRACARTERA
                            @FIRMA = ?,
                            @PRODUCTOCLIENTE = ?,
                            @ACTIVOS = ?,
                            @PRODUCTO = ?,
                            @DICTAMINACION = ?,
                            @ULTIMAGESTION = ?,
                            @SALDO_MIN = ?,
                            @SALDO_MAX = ?,
                            @FECHA_GESTION = ?,
                            @CP_CTE = ?,
                            @COLONIA_CTE = ?,
                            @POBLACION_CTE = ?,
                            @ESTADO_CTE = ?,
                            @TERRITORIO = ?,
                            @TERRITORIAL = ?,
                            @ZONA = ?,
                            @ZONAL = ?,
                            @NOMBRE_DESPACHO = ?,
                            @GERENCIA = ?;`

        const response = await db.query(sql, {
            replacements: [firma, productoCliente, activos, producto,dictaminacion, ultimaGestion, saldoMin, saldoMax, fechaGestion, cpCte, coloniaCte, poblacionCte, estadoCte, territorio, territorial, zona, zonal, nombreDespacho, gerencia],
            type: QueryTypes.RAW
        });

        // Verifica si hay un error en la carga
        if (response[0][0]?.error_carga == '1') {
            return res.json({
                status: false,
                info: {
                    msg: response[0].mensaje
                },
                data: []
            });
        }

        // Obtener solo los valores únicos de cliente_unico
        const clienteUnicos = [...new Set(response[0].map(item => item.cliente_unico))];

        return res.json({
            status: true,
            info: {
                msg: 'Filtrado exitoso',
            },
            totalRegistros: clienteUnicos.length,
            data: clienteUnicos  // Devolver solo los clientes únicos
        });

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al filtrar cartera'
            },
            data: [error]
        });
    }
}


module.exports.obtieneFiltros = async (req, res) => {
    const { firma = '', productoCliente = '' } = req.body;

    try {
        const sql = `EXEC SP_OBTIENEFILTROS
                            @FIRMA = ?,
                            @PRODUCTOCLIENTE = ?;`;

        const response = await db.query(sql, {
            replacements: [firma, productoCliente],
            type: QueryTypes.RAW
        });

        // Inicializar los grupos de datos como arreglos
        const groupedData = {
            productos: [],
            estado_cte: [],
            territorio: [],
            territorial: [],
            zona: [],
            zonal: [],
            despacho: []
        };

        // Iterar sobre la respuesta para agrupar los elementos
        response[0].forEach(item => {
            // Productos
            if (item.producto && !groupedData.productos.includes(item.producto)) {
                groupedData.productos.push(item.producto);
            }
            // Estados
            if (item.estado_cte && !groupedData.estado_cte.includes(item.estado_cte)) {
                groupedData.estado_cte.push(item.estado_cte);
            }
            // Territorios
            if (item.territorio && !groupedData.territorio.includes(item.territorio)) {
                groupedData.territorio.push(item.territorio);
            }
            // Territoriales
            if (item.territorial && !groupedData.territorial.includes(item.territorial)) {
                groupedData.territorial.push(item.territorial);
            }
            // Zonas
            if (item.zona && !groupedData.zona.includes(item.zona)) {
                groupedData.zona.push(item.zona);
            }
            // Zonales
            if (item.zonal && !groupedData.zonal.includes(item.zonal)) {
                groupedData.zonal.push(item.zonal);
            }
            // Despachos
            if (item.nombre_despacho && !groupedData.despacho.includes(item.nombre_despacho)) {
                groupedData.despacho.push(item.nombre_despacho);
            }
        });

        // Enviar los datos agrupados en un formato de lista
        return res.json({
            status: true,
            info: {
                msg: 'Obtención de filtros exitosa',
            },
            data: {
                productos: groupedData.productos,
                estado_cte: groupedData.estado_cte,
                territorio: groupedData.territorio,
                territorial: groupedData.territorial,
                zona: groupedData.zona,
                zonal: groupedData.zonal,
                despacho: groupedData.despacho,
            },
        });

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al filtrar cartera',
            },
            data: [error],
        });
    }
};



module.exports.asignacionManual = async (req, res) => {

    const { usuario } = req?.payload;


    const {
        gestores = '',
        nombreAsignacion = '',
        tipoAsignacion = 1,
        firma = '',
        productoCliente = '',
        activos = 1,
        producto = '',
        dictaminacion = '',
        ultimaGestion = '',
        saldoMin = '',
        saldoMax = '',
        fechaGestion = '',
        cpCte = '',
        coloniaCte = '',
        poblacionCte = '',
        estadoCte = '',
        territorio = '',
        territorial = '',
        zona = '',
        zonal = '',
        nombreDespacho = '',
        gerencia = ''
    } = req.body;

    try {
        const sql = `EXEC SP_CLIENTESASIGNACIONMANUAL
                            @FIRMA = ?,
                            @PRODUCTOCLIENTE = ?,
                            @USUARIOASIGNADOR = ? ,
                            @GESTORES = ? ,
                            @NOMBREASIGNACION = ?,
                            @TIPOASIGNACION = ?,
                            @ACTIVOS = ?,
                            @PRODUCTO = ?,
                            @DICTAMINACION = ?,
                            @ULTIMAGESTION = ?,
                            @SALDO_MIN = ?,
                            @SALDO_MAX = ?,
                            @FECHA_GESTION = ?,
                            @CP_CTE = ?,
                            @COLONIA_CTE = ?,
                            @POBLACION_CTE = ?,
                            @ESTADO_CTE = ?,
                            @TERRITORIO = ?,
                            @TERRITORIAL = ?,
                            @ZONA = ?,
                            @ZONAL = ?,
                            @NOMBRE_DESPACHO = ?,
                            @GERENCIA = ?;`

        const response = await db.query(sql, {
            replacements: [firma, productoCliente,usuario,gestores,nombreAsignacion,tipoAsignacion, activos, producto,dictaminacion, ultimaGestion, saldoMin, saldoMax, fechaGestion, cpCte, coloniaCte, poblacionCte, estadoCte, territorio, territorial, zona, zonal, nombreDespacho, gerencia],
            type: QueryTypes.RAW
        });

        // Verifica si hay un error en la carga
        if (response[0][0]?.error_carga == '1') {
            return res.json({
                status: false,
                info: {
                    msg: response[0].mensaje
                },
                data: []
            });
        }

         
        return res.json({
            status: true,
            info: {
                msg: 'Asignacion Exitosa',
            },
            data: response [0] 
        });

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al asignar cartera'
            },
            data: [error]
        });
    }
}




module.exports.getAsignacionXAgente = async (req, res) => {

    const { usuario } = req?.payload;

 

    try {
        const sql = `EXEC SP_OBTIENEASIGNACIONESXAGENT
                            @AGENTE = ? ;`

        const response = await db.query(sql, {
            replacements: [usuario],
            type: QueryTypes.RAW
        });

        // Verifica si hay un error en la carga
        if (response[0][0]?.error_carga == '1') {
            return res.json({
                status: false,
                info: {
                    msg: response[0].mensaje
                },
                data: []
            });
        }

         
        return res.json({
            status: true,
            info: {
                msg: 'Obtencion de Asignaciones exitosa',
            },
            data: response [0] 
        });

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al asignar cartera'
            },
            data: [error]
        });
    }
}

module.exports.obtieneAsignacion = async (req, res) => {
    const { usuario } = req?.payload;
	const { idAsignacion } = req.params;

	try {
		const sql = `EXEC SP_OBTIENEASIGNACION 
		@AGENTE = ?,
        @IDASGINACION = ?`;

		const respuesta = await db.query(sql, {
			replacements: [usuario,idAsignacion],
			type: QueryTypes.RAW

		});

		return res.json({
            status: true,
            info: {
                msg: 'Consulta exitosa'
            },
            data: respuesta[0]
        });

	} catch (error) {
		console.error(error);

		return res.json({
            status: false,
            info: {
				msg: 'No se obtenieron datos'
            },
            data: []
        });
	}




}
