const db = require('../models');
const excel = require("exceljs");
const { getPromesasClientesBancoAztecaFilter, getPromesasClientesCameFilter, getPromesasClientesApoyoEconomicoFilter } = require('../helpers/searchPromesasNew');
const { formatResumenPromesasPago, formatResumenPagos } = require('../helpers/mapear-reportes');
const { getPagosClientesBancoAzteca, getPagosClientesCame, getPagosClientesApoyo } = require('../helpers/search-pago-reporte');
const { getIteracionesBancoAzteca, getIteracionesCame, getIteracionesApoyoEconomico } = require('../helpers/serachIteraciones');
const { QueryTypes } = require('sequelize');
const Firma = require("../models/firma.model");
const Productos = require("../models/productos.model");


require('dotenv').config();
process.env.TZ = 'America/Monterrey';


exports.reportePromesasPagos = async (req, res) => {


    const { fecha_inicio, fecha_limite, firma = '', producto = '', nuevas = '' } = req.query;

    let clientesMap = [];
    let resumenMap = [];

    try {

        if (firma == 1) {

            const [resumen, clientesBa] = await getPromesasClientesBancoAztecaFilter({ fecha_inicio, fecha_limite, producto, nuevas });
            clientesMap = clientesBa;
            resumenMap = resumen;

        } else if (firma == 2) {

            const [resumen, clientesCame] = await getPromesasClientesCameFilter({ fecha_inicio, fecha_limite, producto, nuevas });
            clientesMap = clientesCame
            resumenMap = resumen;

        } else if (firma == 3) {

            const [resumen, clientesApoyo] = await getPromesasClientesApoyoEconomicoFilter({ fecha_inicio, fecha_limite, producto, nuevas });
            clientesMap = clientesApoyo;
            resumenMap = resumen;
        } else {

            const [clientesBancoAzteca, clientesCame, clientesApoyo] = await Promise.all([
                getPromesasClientesBancoAztecaFilter({ fecha_inicio, fecha_limite, producto, nuevas }),
                getPromesasClientesCameFilter({ fecha_inicio, fecha_limite, producto, nuevas }),
                getPromesasClientesApoyoEconomicoFilter({ fecha_inicio, fecha_limite, producto, nuevas })
            ]);

            // Unir los direntes arreglos.
            resumenMap = [...clientesBancoAzteca[0], ...clientesCame[0], ...clientesApoyo[0]];
            clientesMap = [...clientesBancoAzteca[1], ...clientesCame[1], ...clientesApoyo[1]];

        }

        // * Validar si se encontraron registros
        if (clientesMap.length <= 0) {
            res.json({ status: true, info: { msg: 'No exiten registros con esas caracteriztecas' }, data: [] });
            return;
        }

        const info = formatResumenPromesasPago(resumenMap);
        return res.json({ status: true, info, data: clientesMap });


    } catch (error) {

        console.log(error)
        return res.json({
            status: false,
            info: { msg: 'Hubo un error al momento de hacer la busqueda de las promesas' },
            data: []
        });
    }




}



exports.generarExcelPromesasPago = async (req, res) => {

    const { fecha_inicio, fecha_limite, firma = '', producto = '', nuevas = '' } = req.query;

    let clientesMap = [];
    let resumenMap = [];

    try {

        if (firma == 1) {

            const [resumen, clientesBa] = await getPromesasClientesBancoAztecaFilter({ fecha_inicio, fecha_limite, producto, nuevas });
            clientesMap = clientesBa;
            resumenMap = resumen;

        } else if (firma == 2) {

            const [resumen, clientesCame] = await getPromesasClientesCameFilter({ fecha_inicio, fecha_limite, producto, nuevas });
            clientesMap = clientesCame
            resumenMap = resumen;

        } else if (firma == 3) {

            const [resumen, clientesApoyo] = await getPromesasClientesApoyoEconomicoFilter({ fecha_inicio, fecha_limite, producto, nuevas });
            clientesMap = clientesApoyo;
            resumenMap = resumen;
        } else {

            const [clientesBancoAzteca, clientesCame, clientesApoyo] = await Promise.all([
                getPromesasClientesBancoAztecaFilter({ fecha_inicio, fecha_limite, producto, nuevas }),
                getPromesasClientesCameFilter({ fecha_inicio, fecha_limite, producto, nuevas }),
                getPromesasClientesApoyoEconomicoFilter({ fecha_inicio, fecha_limite, producto, nuevas })
            ]);

            // Unir los direntes arreglos.
            resumenMap = [...clientesBancoAzteca[0], ...clientesCame[0], ...clientesApoyo[0]];
            clientesMap = [...clientesBancoAzteca[1], ...clientesCame[1], ...clientesApoyo[1]];

        }


        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("promesas");

        /*****************/
        let columnas = [];

        if (clientesMap.length === 0) {
            worksheet.columns = [
                { header: "ID_CLIENTE", key: "id_cliente", width: 30 },
                { header: "NOMBRE_CLIENTE", key: "nombre_cliente", width: 30 },
                { header: "ID_PROMESA", key: "id_promesa", width: 10 },
                { header: "GESTOR", key: "gestor", width: 30 },
                { header: "FECHA_GESTION", key: "fecha_gestion", width: 25 },
                { header: "FECHA_PROMESA", key: "fecha_promesa", width: 25 },
                { header: "FIRMA", key: "firma", width: 30 },
                { header: "MONTO", key: "monto", width: 25 },
                { header: "ESTATUS", key: "estatus", width: 25 },
                { header: "NOMBRE_PRODUCTO", key: "nombre_producto", width: 30 },
            ];
        } else {
            const keys = Object.keys(clientesMap[0]);
            
            columnas = keys.map((key_resumnen = '') => {
                return { header: key_resumnen.toUpperCase(), key: key_resumnen, width: 25 }
            })
        }

        // worksheet.columns = [
        //     { header: "ID_CLIENTE", key: "id_cliente", width: 30 },
        //     { header: "NOMBRE_CLIENTE", key: "nombre_cliente", width: 30 },
        //     { header: "ID_PROMESA", key: "id_promesa", width: 10 },
        //     { header: "GESTOR", key: "gestor", width: 30 },
        //     { header: "FECHA_GESTION", key: "fecha_gestion", width: 25 },
        //     { header: "FECHA_PROMESA", key: "fecha_promesa", width: 25 },
        //     { header: "FIRMA", key: "firma", width: 30 },
        //     { header: "MONTO", key: "monto", width: 25 },
        //     { header: "ESTATUS", key: "estatus", width: 25 },
        //     { header: "NOMBRE_PRODUCTO", key: "nombre_producto", width: 30 },
        // ];

        worksheet.columns = columnas; 
        /***********/
        
        // Add Array Rows
        worksheet.addRows(clientesMap);
        // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "reporte-promesas.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });


    } catch (error) {
        console.log(error)

        return res.json({
            status: false,
            info: { msg: 'Hubo un error al momento de crear el excel.' },
            data: []
        });
    }
}



exports.reportePagos = async (req, res) => {

    const { fecha_inicio, fecha_limite, firma = '', producto = '' } = req.query;

    let pagos = [];
    let resumenPagos = [];



    try {


        if (firma == 1) {

            const [resumenCA, pagosCA] = await getPagosClientesBancoAzteca({ fecha_inicio, fecha_limite, producto });
            resumenPagos = resumenCA;
            pagos = pagosCA;

        } else if (firma == 2) {

            const [resumenCC, pagosCC] = await getPagosClientesCame({ fecha_inicio, fecha_limite, producto });
            resumenPagos = resumenCC;
            pagos = pagosCC;

        } else if (firma == 3) {

            const [resumenCAE, pagosCAE] = await getPagosClientesApoyo({ fecha_inicio, fecha_limite, producto });
            resumenPagos = resumenCAE;
            pagos = pagosCAE;

        } else {

            const [dataAzteca, dataCame, dataApoyo] = await Promise.all([
                getPagosClientesBancoAzteca({ fecha_inicio, fecha_limite, producto }),
                getPagosClientesCame({ fecha_inicio, fecha_limite, producto }),
                getPagosClientesApoyo({ fecha_inicio, fecha_limite, producto }),
            ]);

            resumenPagos = [...dataAzteca[0], ...dataCame[0], ...dataApoyo[0]];
            pagos = [...dataAzteca[1], ...dataCame[1], ...dataApoyo[1]];
        }

        if (pagos.length <= 0) {
            res.json({ status: true, info: { msg: 'No exiten registros con esas caracteriztecas' }, data: [] });
            return;
        }

        const info = formatResumenPagos(resumenPagos);
        return res.json({
            status: true,
            info,
            data: pagos
        });


    } catch (error) {

        return res.json({
            status: false,
            info: { msg: 'Hubo un error al momento de buscar los reportes de pagos.' },
            data: []
        })
    }




}


exports.generarExcelPago = async (req, res) => {

    const { fecha_inicio, fecha_limite, firma = '', producto = '' } = req.query;

    let pagos = [];
    let resumenPagos = [];

    try {


        if (firma == 1) {

            const [resumenCA, pagosCA] = await getPagosClientesBancoAzteca({ fecha_inicio, fecha_limite, producto });
            resumenPagos = resumenCA;
            pagos = pagosCA;

        } else if (firma == 2) {

            const [resumenCC, pagosCC] = await getPagosClientesCame({ fecha_inicio, fecha_limite, producto });
            resumenPagos = resumenCC;
            pagos = pagosCC;

        } else if (firma == 3) {

            const [resumenCAE, pagosCAE] = await getPagosClientesApoyo({ fecha_inicio, fecha_limite, producto });
            resumenPagos = resumenCAE;
            pagos = pagosCAE;

        } else {

            const [dataAzteca, dataCame, dataApoyo] = await Promise.all([
                getPagosClientesBancoAzteca({ fecha_inicio, fecha_limite, producto }),
                getPagosClientesCame({ fecha_inicio, fecha_limite, producto }),
                getPagosClientesApoyo({ fecha_inicio, fecha_limite, producto }),
            ]);

            resumenPagos = [...dataAzteca[0], ...dataCame[0], ...dataApoyo[0]];
            pagos = [...dataAzteca[1], ...dataCame[1], ...dataApoyo[1]];
        }

        if (pagos.length <= 0) {
            res.json({ status: true, info: { msg: 'No exiten registros con esas caracteriztecas' }, data: [] });
            return;
        }

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("pagos");
        let columnas = [];

        if (pagos.length === 0) {
            columnas = [
                { header: "ID_CLIENTE", key: "id_cliente", width: 25 },
                { header: "NOMBRE_CLIENTE", key: "nombre_cliente", width: 25 },
                { header: "GESTOR", key: "gestor", width: 25 },
                { header: "TIPO_CONTACTO", key: "tipo_contacto", width: 30 },
                { header: "MONTO", key: "monto", width: 25 },
                { header: "TIPO_PAGO", key: "tipo_pago", width: 25 },
                { header: "FECHA_GESTION", key: "fecha_gestion", width: 25 },
                { header: "FECHA_PAGO", key: "fecha_pago", width: 25 },
                { header: "NOMBRE_PRODUCTO", key: "nombre_producto", width: 25 },
                { header: "FIRMA", key: "firma", width: 25 },
            ];
        } else {
            const keys = Object.keys(pagos[0]);
            
            columnas = keys.map((key_pago = '') => {
                return { header: key_pago.toUpperCase(), key: key_pago, width: 25 }
            })
        }

        // worksheet.columns = [
        //     { header: "ID_CLIENTE", key: "id_cliente", width: 25 },
        //     { header: "NOMBRE_CLIENTE", key: "nombre_cliente", width: 25 },
        //     { header: "GESTOR", key: "gestor", width: 25 },
        //     { header: "TIPO_CONTACTO", key: "tipo_contacto", width: 30 },
        //     { header: "MONTO", key: "monto", width: 25 },
        //     { header: "TIPO_PAGO", key: "tipo_pago", width: 25 },
        //     { header: "FECHA_GESTION", key: "fecha_gestion", width: 25 },
        //     { header: "FECHA_PAGO", key: "fecha_pago", width: 25 },
        //     { header: "NOMBRE_PRODUCTO", key: "nombre_producto", width: 25 },
        //     { header: "FIRMA", key: "firma", width: 25 },
        // ];

        worksheet.columns = columnas;
        // Add Array Rows
        worksheet.addRows(pagos);
        // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "reporte-pagos.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });

    } catch (error) {

        return res.json({
            status: false,
            info: { msg: 'Hubo un error al momento de crear el excel.' },
            data: []
        })
    }

}



exports.reporteTipificaciones = async (req, res) => {

    const { page = 1, limit = 20, fecha_inicio, fecha_limite, firma = '', tipificacion = '' } = req.query;

    let data;
    let countRows;

    try {


        if (firma == 1) {
            const { count, rows } = await getIteracionesBancoAzteca({ page, limit, fecha_inicio, fecha_limite, tipificacion });
            countRows = count;
            data = rows;

        } else if (firma == 2) {

            const { count, rows } = await getIteracionesCame({ page, limit, fecha_inicio, fecha_limite, tipificacion, reporte: true });
            countRows = count;
            data = rows;

        } else if (firma == 3) {
            const { count, rows } = await getIteracionesApoyoEconomico({ page, limit, fecha_inicio, fecha_limite, tipificacion });
            countRows = count;
            data = rows;

        }

        return res.json({
            status: true,
            info: {
                msg: '',
                total: countRows,
                pages: Math.ceil(countRows / limit),
                current_page: Number(page)
            },
            data
        });

    } catch (error) {

        return res.json({
            status: false,
            info: {
                msg: 'Error! Algo salio mal al momento de buscar las tipificaciones para lo reportes',
            },
            data: [],
        })
    }
}


exports.generarExcelInteraciones = async (req, res) => {

    const { fecha_inicio, fecha_limite, firma = '', tipificacion = '' } = req.query;

    let data;

    try {


        if (firma == 1) {
            const { rows } = await getIteracionesBancoAzteca({ page: 1, limit: 10000, fecha_inicio, fecha_limite, tipificacion, reporte: true });
            data = rows;

        } else if (firma == 2) {

            const { rows } = await getIteracionesCame({ page: 1, limit: 10000, fecha_inicio, fecha_limite, tipificacion, reporte: true });
            data = rows;

        } else if (firma == 3) {

            const { rows } = await getIteracionesApoyoEconomico({ page: 1, limit: 10000, fecha_inicio, fecha_limite, tipificacion, reporte: true });
            data = rows;
        }


        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Interaciones");

        /*** **********/
        let columnas = [];

        if (data.length === 0) {
            worksheet.columns =  [
                    { header: "ID", key: "id", width: 8 },
                    { header: "CLIENTE_ID", key: "cliente_id", width: 25 },
                    { header: "FECHA_GESTION", key: "fecha_gestion", width: 25 },
                    { header: "ID_INTERACCION", key: "id_interaccion", width: 30 },
                    { header: "ID_TAREA", key: "id_tarea", width: 25 },
                    { header: "GESTOR", key: "gestor", width: 25 },
                    { header: "TELEFONO_CONTACTO", key: "telefono_contacto", width: 25 },
                    { header: "CODIGO_ACCION", key: "tipificacione.codigo_accion", width: 25 },
                    { header: "CODIGO_RESULTADO", key: "tipificacione.codigo_resultado", width: 25 },
                    { header: "CODIGO_RESULTADO_SIGLAS", key: "tipificacione.codigo_resultado_siglas", width: 25 },
                    { header: "NOMBRE", key: "cliente.nombre", width: 25 },
                ];
        } else {
            const keys = Object.keys(data[0]);
            
            columnas = keys.map((key_data = '') => {
                return { header: key_data.toUpperCase(), key: key_data, width: 25 }
            })
        }

        // worksheet.columns = [
        //     { header: "ID", key: "id", width: 8 },
        //     { header: "CLIENTE_ID", key: "cliente_id", width: 25 },
        //     { header: "FECHA_GESTION", key: "fecha_gestion", width: 25 },
        //     { header: "ID_INTERACCION", key: "id_interaccion", width: 30 },
        //     { header: "ID_TAREA", key: "id_tarea", width: 25 },
        //     { header: "GESTOR", key: "gestor", width: 25 },
        //     { header: "TELEFONO_CONTACTO", key: "telefono_contacto", width: 25 },
        //     { header: "CODIGO_ACCION", key: "tipificacione.codigo_accion", width: 25 },
        //     { header: "CODIGO_RESULTADO", key: "tipificacione.codigo_resultado", width: 25 },
        //     { header: "CODIGO_RESULTADO_SIGLAS", key: "tipificacione.codigo_resultado_siglas", width: 25 },
        //     { header: "NOMBRE", key: "cliente.nombre", width: 25 },
        // ];

        worksheet.columns = columnas; 

        /************ */
        


        // Add Array Rows
        worksheet.addRows(data);

        // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "reporte-iteraciones.xlsx"
        );
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });


    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            info: {
                msg: 'Error! Algo salio mal al momento de crear el excel de los reportes',
            },
            data: [],
        })
    }
}


exports.reporteGestiones = async (req, res) => {


    const { fechaInicio, fechaLimite, firma = '', producto = '', tipoReporte = '' } = req.query;

    let clientesMap = [];
    let resumenMap = [];

    try {

        const sql = `EXEC [SP_GETREPORTES]
        @fechaInicio = ?,
        @fechaLimite = ?,
        @firma = ?,
        @producto = ?,
        @tipoReporte = ?`; 

        const  responses = await db.query(sql, {
            replacements: [fechaInicio, fechaLimite, firma , producto , tipoReporte ],
            type: QueryTypes.RAW
        });
       
        // * Validar si se encontraron registros
        if (responses.length <= 0) {
            res.json({ status: true, info: { msg: 'No exiten registros con esas caracteriztecas' }, data: [] });
            return;
        }

        const info = formatResumenPromesasPago(resumenMap);
        return res.json({ status: true, data: responses });


    } catch (error) {

        console.log(error)
        return res.json({
            status: false,
            info: { msg: 'Hubo un error al momento de hacer la busqueda de las gestiones' },
            data: []
        });
    }




}



module.exports.obtenerReportesXFirma = async (req, res) => {

    const { id_firma } = req.params;

    try {
      
        const sql = `EXEC [GET_REPORTESXFIRMA]
        @FIRMA = ? `; 

        const  reportes = await db.query(sql, {
            replacements: [id_firma],
            type: QueryTypes.RAW
        });



        return res.json({
            status: true,
            info: {
                msg: 'reportes'
            },
            data: reportes

        });

    } catch (error) {
        console.error(error);

        return res.json({
            status: false,
            info: {
                msg: 'No se pudieron cargar los reportes'
            },
            data: []

        });
    }
}


module.exports.getEstadoPortafolio = async (req, res) => {

    const { id_firma } = req.params;

    try {
      
        const sql = `EXEC [SP_GETESTADOPORTAFOLIO]`; 

        const  reportes = await db.query(sql, {
            replacements: [id_firma],
            type: QueryTypes.RAW
        });



        return res.json({
            status: true,
            info: {
                msg: 'reportes'
            },
            data: reportes

        });

    } catch (error) {
        console.error(error);

        return res.json({
            status: false,
            info: {
                msg: 'No se pudieron cargar los reportes'
            },
            data: []

        });
    }
}