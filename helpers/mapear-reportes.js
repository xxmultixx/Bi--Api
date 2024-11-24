
const formatResumenPromesasPago = (resumen = []) => {

    const resumenMap = {
        sumaTotal: 0,
        totalPromesas: { rotas: 0, proceso: 0, completas: 0 },
        sumaPromesas: { rotas: 0, proceso: 0, completas: 0 }
    }

    for (let i = 0; i < resumen.length; i++) {

        switch (resumen[i]['estatus']) {
            case 'completa':
                resumenMap.totalPromesas.completas += resumen[i]["total_promesa"];
                resumenMap.sumaPromesas.completas += resumen[i]["suma_promesas"];
                break;

            case 'proceso':
                resumenMap.totalPromesas.proceso += resumen[i]["total_promesa"];
                resumenMap.sumaPromesas.proceso += resumen[i]["suma_promesas"];
                break;

            case 'rota':
                resumenMap.totalPromesas.rotas += resumen[i]["total_promesa"];
                resumenMap.sumaPromesas.rotas += resumen[i]["suma_promesas"];
                break;
            default:
                break;
        }

        resumenMap.sumaTotal += resumen[i]["suma_promesas"];
    }


    return resumenMap;
}

const formatResumenPagos = (resumen = []) => {

    const resumenMap = {
        sumaTotal: 0,
        totalPagos: { pagoInicial: 0, pagoRecurrente: 0, pagoParcial: 0, liquidacion: 0, moratorios: 0 },
        sumaPagos: { pagoInicial: 0, pagoRecurrente: 0, pagoParcial: 0, liquidacion: 0, moratorios: 0 }
    }

    for (let i = 0; i < resumen.length; i++) {

        switch (resumen[i]['tipo_pago']) {
            case 'Pago Inicial':
                resumenMap.totalPagos.pagoInicial += resumen[i]["total_pagos"];
                resumenMap.sumaPagos.pagoInicial += resumen[i]["suma_pagos"];
                break;

            case 'Pago Recurrente':
                resumenMap.totalPagos.pagoRecurrente += resumen[i]["total_pagos"];
                resumenMap.sumaPagos.pagoRecurrente += resumen[i]["suma_pagos"];
                break;

            case 'Pago Parcial':
                resumenMap.totalPagos.pagoParcial += resumen[i]["total_pagos"];
                resumenMap.sumaPagos.pagoParcial += resumen[i]["suma_pagos"];
                break;

            case 'Moratorios':
                resumenMap.totalPagos.moratorios += resumen[i]["total_pagos"];
                resumenMap.sumaPagos.moratorios += resumen[i]["suma_pagos"];
                break;


            case 'Liquidacion':
                resumenMap.totalPagos.liquidacion += resumen[i]["total_pagos"];
                resumenMap.sumaPagos.liquidacion += resumen[i]["suma_pagos"];
                break;


            default:
                break;
        }

        resumenMap.sumaTotal += resumen[i]["suma_pagos"];
    }


    return resumenMap;
}


module.exports = {
    formatResumenPromesasPago,
    formatResumenPagos
}


