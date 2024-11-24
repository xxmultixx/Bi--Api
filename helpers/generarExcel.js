const xlsx = require('xlsx');
const path = require('path');



const exportExcel = (data, workSheetColumnName, workSheetName, filepath) => {


    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnName,
        ...data
    ];

    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName)
    xlsx.writeFile(workBook, path.resolve(filepath));

}

const exportExcelPromesasPagos = (clientes = [], workSheetColumnName, workSheetName, filepath) => {

    const data = clientes.map(c => ([
        c.id_cliente, c.nombre_cliente, c.id_promesa, c.gestor, c.fecha_gestion,
        c.fecha_promesa, c.firma, c.monto, c.estatus, c.nombre_producto,
    ]));

    exportExcel(data, workSheetColumnName, workSheetName, filepath);
}


const exportExcelPagos = (pagos = [], workSheetColumnName, workSheetName, filepath) => {

    const data = pagos.map(c => ([
        c.id_cliente, c.nombre_cliente, c.gestor,
        c.tipo_contacto, c.monto, c.tipo_pago,
        c.fecha_gestion, c.fecha_pago, c.nombre_producto, c.firma,
    ]));

    exportExcel(data, workSheetColumnName, workSheetName, filepath);
}



module.exports = {
    exportExcelPromesasPagos,
    exportExcelPagos
}









