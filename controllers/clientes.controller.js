const Sequelize = require('sequelize');
const buscarClienteFirmaKey = require('../helpers/buscarClienteFirmaKey');
const { buscarCliente, validarNumeroClientes } = require('../helpers/validarDB');
const db = require('../models');
const clientesApoyoEconomico = require('../models/clientes-apoyo-economico.model');
const ClientesBancoAzteca = require('../models/clientes-banco-azteca.model');
const ClientesCamel = require('../models/clientes-camel.model');
const PromesasPago = require('../models/promesas-pago.model');
const { QueryTypes } = require('sequelize');

// Firmas => Banco_Azteca,Apoyo_Economico,Camel

module.exports.obtenerCliente = async (req, res) => {

    const { dnis = '', key = '', tipo = '', firma = '' } = req.query;

    try {
        let arrResultado = [];

        if (firma !== '' && key != '') {
            arrResultado = await buscarClienteFirmaKey({
                firma_cliente: firma,
                key: key
            });
        } else {

            arrResultado = await buscarCliente({ cliente: key, dnis });

            return res.json({ status: true, info: { msg: '', total_registros: arrResultado.length }, data: arrResultado })
        }

        if (arrResultado.length === 0) {
            res.json({ status: false, info: { msg: 'No se encontraron registros que coincidan con los parametros solicitados.' }, data: [] })
            return;
        }
        // Obtener los numeros telefonicos de ls resgistros encontrados
        let promises = [];
        arrResultado.forEach((data, index) => {

            if (data.firma == 'Banco_Azteca') {

                promises.push(validarNumeroClientes([data.cliente.telefono1, data.cliente.telefono2, data.cliente.telefono3, data.cliente.telefono4]));

            } else if (data.firma == 'Apoyo_Economico') {

                promises.push(validarNumeroClientes([data.cliente.tel1, data.cliente.tel2, data.cliente.cel]));

            } else if (data.firma == 'Camel') {

                promises.push(validarNumeroClientes([data.cliente.telefono, data.cliente.telefono2]));
            }

        });

        // Resolver las promesas y remplazar los datos.
        await Promise.all(promises).then(resp => {
            const clientes = [];

            resp.forEach((arrTiposNum, index) => {

                if (arrTiposNum.length === 4) {

                    // Banco Azteca...
                    const [num1, num2, num3, num4] = arrTiposNum;
                    const { cliente, firma } = arrResultado[index];
                    cliente.tipotel1 = num1
                    cliente.tipotel2 = num2
                    cliente.tipotel3 = num3
                    cliente.tipotel4 = num4
                    clientes.push({ firma, cliente });

                } else if (arrTiposNum.length === 3) {

                    // Apoyo Economico.
                    const [num1, num2, num3] = arrTiposNum;
                    const { cliente, firma } = arrResultado[index];
                    cliente.tipotel1 = num1
                    cliente.tipotel2 = num2
                    cliente.tipotel3 = num3
                    clientes.push({ firma, cliente });


                } else if (arrTiposNum.length == 2) {

                    // Camel
                    const [num1, num2] = arrTiposNum;
                    const { cliente, firma } = arrResultado[index];
                    cliente.tipotel1 = num1
                    cliente.tipotel2 = num2
                    clientes.push({ firma, cliente });
                }

            })

            return res.json({ status: true, info: { msg: '', total_registros: arrResultado.length }, data: clientes })
        })



    } catch (error) {

        console.error(error);
        return res.json({ status: false, info: { msg: '' }, data: [] })
    }

}

module.exports.obtenerClienteFront = async (req, res) => {

    const { dnis = '', key = '', tipo = '', firma = '' } = req.query;
     let dataResposne = {};
    try {
         
        const sql = `EXEC [GET_CLIENTES] 
            @TELEFONO = ? , 
            @CLIENTE = ?`; 
    
            const  responses = await db.query(sql, {
                replacements: [dnis,key],
                type: QueryTypes.RAW
            });
       console.log("responses:" +responses[0])

       responses[0][0].telefonos = {};
       
      
       //dataResposne.DataGeneral.firma = firma;
       //dataResposne.test.test2 = firma;
       console.log(responses[0][0].telefono1);
let telefonosNum = 0;


  
       let telefonos = [responses[0][0].telefono1,responses[0][0].telefono2,responses[0][0].telefono3,responses[0][0].telefono4];
       let telefonosResponse =[];
       for (let i = 0; i < telefonos.length; i++) {

        if (telefonos[i] !== 'N/A'){
            let jsonTelefonos = {};

            telefonosNum = telefonosNum + 1;
      console.log("telefonos[i]:" + telefonos[i] );
        const telefonosQuery = ` EXEC [SP_GETDETALLETEL] 
        @DID = ?`;
        const  responseTel = await db.query(telefonosQuery, {
            replacements: [telefonos[i]],
            type: QueryTypes.RAW
        });
        jsonTelefonos.nroLinea = i +1;
        jsonTelefonos.datosTelefono = responseTel[0] ;

        console.log("responseTel:" + responseTel[0] );

        telefonosResponse.push(jsonTelefonos);
     }
      }
     
console.log("telefonosResponse:" + telefonosResponse);
//dataResposne.DataGeneral.Telefonos = telefonosResponse;
//dataResposne.DataGeneral.TelefonosValidos= telefonosNum;
responses[0][0].telefonos.telefonosValidos = telefonosNum;
responses[0][0].telefonos.lineas = telefonosResponse;       

dataResposne.DataGeneral = responses[0];
        return res.json({ status: true, info: { msg: 'Consumo Exitoso', total_registros: responses.length }, data: dataResposne })
             

    } catch (error) {

        console.error(error);
        return res.json({ status: false, info: { msg:  error }, data: [] })
    }

}


module.exports.activarCliente = async (req, res) => {

    const { firma, id_cliente } = req.body;

    let cliente = null;

    try {

        switch (firma) {
            case 'banco_azteca':

                cliente = await ClientesBancoAzteca.findOne({
                    where: {
                        cliente_unico: id_cliente
                    }
                });

                break;

            case 'came':

                cliente =await ClientesCamel.findOne({
                    where: {
                        id_socio: id_cliente
                    }
                });

                break;

            case 'apoyo_economico':

                cliente = await clientesApoyoEconomico.findOne({
                    where: {
                        operacionesid: id_cliente
                    }
                });

                break;

            default:
                break;
        }

        if( !cliente ){
            return res.json({ 
                status: false, 
                info: { msg: 'No se encontro cliente' }, 
                data: [] 
            }) 
        }

        cliente.activo = 1 ;
        
        await cliente.save();

        return res.json({ 
            status: true, 
            info: { msg: 'Cliente actualizado' }, 
            data: cliente 
        })

    } catch (error) {
        
        console.error(error);
        
        return res.json({ 
            status: false, 
            info: { msg: 'No se pudo actualizar cliente' }, 
            data: [] 
        })
    }


}

module.exports.gestionesCredito = async (req, res ) => {

    const { dnis = '', key = ''} = req.query; 
 

    try {
        const sql = `EXEC SP_GET_GESTIONESCREDITO 
        @CLIENTE = ? ,
        @TELEFONO = ? ;`

    
        const response = await db.query(sql, {
            replacements: [key,dnis],
            type: QueryTypes.RAW
        });
        
 
        if( response[0][0]?.error_carga == '1' ){
            return res.json({
                status: false,
                info: {
                    msg: response[0][0].mensaje
                },
                data: []
            })
        }

        return res.json({
            status: true,
            info: {
                msg: 'ConsumoExitoso',
            },
            data: response[0] 
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al subir la carga'
            },
            data: []
        })
    }


}

module.exports.gestionesCreditoResumen = async (req, res ) => {

    const { dnis = '', key = ''} = req.query; 
 

    try {
       

        const sql = `EXEC GET_PROMESASPAGOS 
        @CLIENTE = ?;`

    
        const resumen = await db.query(sql, {
            replacements: [key],
            type: QueryTypes.RAW
        });

        if( resumen[0][0]?.error_carga == '1' ){
            return res.json({
                status: false,
                info: {
                    msg: resumen[0][0].mensaje
                },
                data: []
            })
        }

        return res.json({
            status: true,
            info: {
                msg: 'ConsumoExitoso',
            },
            data: resumen
        })


    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'Hubo un error al subir la carga'
            },
            data: []
        })
    }


}




module.exports.getPromesasCliente = async (req, res) => {

    const { cliente }  = req.query;
    try {
         
        const sql = `EXEC [GET_TIPIFICADORPROMESAS] 
            @CLIENTE = ?`; 
    
            const  responses = await db.query(sql, {
                replacements: [cliente],
                type: QueryTypes.RAW
            });
       return res.json({ status: true, info: { msg: 'Consumo Exitoso', total_registros: responses.length }, data: responses })
             

    } catch (error) {

        console.error(error);
        return res.json({ status: false, info: { msg:  error }, data: [] })
    }

}


module.exports.busquedaClientes = async (req, res) => {

    const { valor = ''} = req.query;
     let dataResposne = {};
    try {
         
        const sql = `EXEC [BUSQUEDACLIENTES] 
            @VALOR = ?`; 
    
            const  response = await db.query(sql, {
                replacements: [valor],
                type: QueryTypes.RAW
            });
       console.log("response:" +response[0])

       return res.json({
        status: true,
        info: {
            msg: 'Busqueda de cliente exitosa',
        },
        data: response
    })     

    } catch (error) {

        return res.json({
            status: false,
            info: {
                msg: 'Busqueda de cliente fallida',
            },
            data: error
        })    
    }

}


