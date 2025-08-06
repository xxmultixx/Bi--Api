const express = require('express');
const router = express.Router();
const { check } = require('express-validator');


const usuarioController = require('../controllers/usuarios.controller');
const interacionesController = require('../controllers/interaciones.controller');
const botoneraController = require('../controllers/botonera.controller');
const menusController = require('../controllers/menusController');
const gestionManualController = require('../controllers/gestion-manual.controller');
const pagosController = require('../controllers/pagos.controller');
const promesasPagoController = require('../controllers/promesas-pago.controller');
const tipificacionesController = require('../controllers/tipificaciones.controller');
const clientesBancoAztecaController = require('../controllers/clientes-banco-azteca.controller');
const accionesController = require('../controllers/acciones.controller');
const busquedaManualController = require('../controllers/busqueda-manual.controller');
const cargasClientesController = require('../controllers/masivos.controller');
const validaTelefonoController = require('../controllers/validaTelefono.controller');
const cargasPagosController = require('../controllers/masivosPagos.controller');
const masivosGestionesController = require('../controllers/masivosGestiones.controller');
const registraNumeroController = require('../controllers/registraNumero.controller');
const registraListaNegra = require('../controllers/listaNegra.controller');
const cargasClientesFrontController = require('../controllers/masivosFront.controller');
const clientesController = require('../controllers/clientes.controller');
const agendaPromesasController = require('../controllers/agenda-promesas.controller');
const ConveniosController = require('../controllers/convenios.controller');
const pagosConveioController = require('../controllers/pagosConvenio.controller');
const firmasController = require('../controllers/firmas.controller');
const productosController = require('../controllers/productos.controller');
const menuController = require('../controllers/menu.controller');
const authController = require('../controllers/auth.controller');
const ReportesController = require('../controllers/reportes.controller');
const CarteoController = require('../controllers/cartero/carteoController'); 
const interacionesCameController = require('../controllers/came/interacciones-came.controller');
const promesasPagoCameController = require('../controllers/came/promesas-pago-came.controller');
const pagosCameController = require('../controllers/came/pagos-came.controller');

const interacionesApoyoEconomicoController = require('../controllers/apoyo-economico/interacciones-apoyo-economico.controller');
const promesasPagoApoyoEconomicoController = require('../controllers/apoyo-economico/promesas-pago-apoyo-economico.controller');
const pagosApoyoEconomicoController = require('../controllers/apoyo-economico/pagos-apoyo-economico.controller');

const rolesController = require('../controllers/roles.controller');

const smsController = require('../controllers/sms.controller');
const blasterController = require('../controllers/blaster.controller');
const blasterMasivoController =  require('../controllers/reportes/envios-masivos-blaster/envios-masivos-blaster.controller');
const smsMasivoController =  require('../controllers/reportes/envios-masivos-sms/envios-masivos-sms.controller');
const emailMasivoController =  require('../controllers/email/email.controller');

const testDiegoController =  require('../controllers/testDiego/testDiego.controller');

/*** MIDDLEWARES ***/
const auth = require('../middleware/auth');
const authGerente = require('../middleware/credencialesGenrente');
const { validarCampos } = require('../middleware/validar-campos');
const uploadCSVFile = require('../middleware/uploadCSVFile');
const uploadImageFile = require ('../middleware/uploadImageFile');


module.exports = function () {

//testDiego
   
    router.get('/pruebaaldo',
    testDiegoController.Apiprueba);
    router.get('/resumen',
    testDiegoController.Resumenmostrar);
    //ruta para mostrar sms enviados
    router.get('/smsmos',
    testDiegoController.MostrarSMS);

    router.post('/Dividir',
    testDiegoController.Dividirporarchivos);
    //Descargar Archivo xd
    router.get('/Descargar',
    testDiegoController.Descargararchivo);
    //----
    router.get('/Mostrarcargas',  ///aldo aqui esta para eliminar las cargas
    testDiegoController.Cargas);

    router.get('/Eliminarcargas',  ///aldo aqui esta para mostrar las cargas
    testDiegoController.EliminarCargas);

    router.post('/testediego', 
    testDiegoController.ArchivoExtraer);

    router.get('/Insertarlista', 
    testDiegoController.InsertarLista);

    router.get('/Mostrarlista', 
    testDiegoController.muestraLista);

    router.post('/Insertalistasms', 
    testDiegoController.InsertaraListaSMS);

    router.get('/Eliminar', 
    testDiegoController.Eliminar);


    //Usuarios
    router.get('/usuarios',
        auth,
        usuarioController.mostrarUsuarios
    );

      //grupos
      router.post('/insertaGrupo',
      auth,
      authGerente,
      usuarioController.insertarGrupo
  );
  //ELIMINA GRUPOS
  router.post('/eliminaGrupo',
  auth,
  authGerente,
  usuarioController.eliminaGrupo
);
    router.get('/gestionesMasivas/:opcion',
        auth,
        authGerente,
        usuarioController.mostrarGestores
    );

    router.get('/getplantillas',
        auth,
        authGerente,
        smsController.smsPlantillas
    );

    router.get('/getMensajesRapidos/:cliente',
       smsController.mensajesRapidos
    );

    router.get('/valida-permiso-agente',
    auth,
    smsController.smsValidaEnvioAgente
    );

    router.get('/valida-permiso-agente_blaster',
    auth,
    blasterController.blasterValidaEnvioAgente
    );


    router.get('/saldos',
    auth,
    smsController.smsSaldosGeneral
    );

    router.get('/saldo-agente',
    auth,
    smsController.smsSaldoAgente
    );

    router.post('/envia-sms-agente',
    auth,
    smsController.smsEnviaSmsAgente
    );

router.post('/edita-saldos-sms',
    auth,
    authGerente,
    smsController.smsEditaSaldos
);

    router.get('/saldos-agentes/:filtro',
    auth,
    authGerente,
    smsController.smsSaldosAgente
);


router.post('/envia-blaster-agente',
auth,
blasterController.blasterEnviaBlasterAgente
);


router.post('/edita-saldos-blaster',
    auth,
    authGerente,
    blasterController.blasterEditaSaldos
);

    router.get('/saldos-agentes_blaster/:filtro',
    auth,
    authGerente,
    blasterController.blasterSaldosAgente
);


    router.post('/altas-plantillas',
        auth,
        authGerente ,
        smsController.smsAltaPlantilla
    );



    router.get('/equipos',
        auth,
        usuarioController.mostrarEquipos
    );
    
    router.get('/usuarios/:idUsuario',
        auth,
        usuarioController.mostrarUsuario
    );


    router.patch('/usuarios',
        auth,
        authGerente,
        [
            check('nombre', 'El nombre es requerido').not().isEmpty(),
            check('usuario', 'El usuario es requerido').not().isEmpty(),
            check('apellido', 'El apellido es requerido').not().isEmpty(),
            validarCampos
        ],
        usuarioController.actualizarUsuario
    );

    
    router.get('/ranking-gerencias',
        auth,
        authGerente ,
        menusController.rankingGerencias
    );


    router.post('/usuarios',
        [
            auth,
            check('nombre', 'El nombre es requerido').not().isEmpty(),
            check('apellido', 'El apellido es requerido').not().isEmpty(),
            check('id_role', 'El role requerido').not().isEmpty(),
            check('id_role', 'El role no es valido').isIn([1, 2, 3]),
            check('usuario', 'El usuario es requerido').not().isEmpty(),
            check('password', 'La contraseña es requerida').not().isEmpty(),
            check('password', 'La contraseña debe contener minimo 4 caracteres').isLength({ min: 4 }),
            validarCampos
        ],
        usuarioController.nuevoUsuario
    );

    router.post('/auth/login',
        [
            check('usuario', 'El usuario es requerido').not().isEmpty(),
            check('password', 'La contraseña es requerida').not().isEmpty(),
            validarCampos
        ],
        authController.autenticarUsuario);


    router.get('/auth/renew', auth, authController.revalidarToken);

    //Interaciones
    router.get('/interacciones/banco_azteca/:cliente_unico', interacionesController.mostrarInteracionesCliente);
    router.post('/interacciones/banco_azteca',
        [
            check('cliente_unico', 'El cliente es requerido').not().isEmpty(),
            check('fecha_gestion', 'La fecha de gestion es requerida').not().isEmpty(),
            check('telefono_contacto', 'El telefono es requerido').not().isEmpty(),
            check('tipo_telefono', 'El tipo telefono es requerida').not().isEmpty(),
            check('id_tipificacion', 'La tipificacion es requerida').not().isEmpty(),
            check('gestor', 'El gestor es requerido').not().isEmpty(),
            validarCampos
        ],
        interacionesController.nuevaInteraccion);

        router.post('/insertaGestion',
        [
            check('cliente', 'El cliente es requerido').not().isEmpty(),
            check('telefonoContacto', 'El telefono es requerido').not().isEmpty(),
            check('idTipificacion', 'La tipificacion es requerida').not().isEmpty(),
            check('gestor', 'El gestor es requerido').not().isEmpty(),
            validarCampos
        ],
        botoneraController.gestion);


        router.post('/insertaPromesa',
        [
            check('cliente', 'El cliente es requerido').not().isEmpty(),
            check('telefonoContacto', 'El telefono es requerido').not().isEmpty(),
            check('idTipificacion', 'La tipificacion es requerida').not().isEmpty(),
            check('gestor', 'El gestor es requerido').not().isEmpty(),
            check('fechaPromesa', 'El fechaPromesa es requerido').not().isEmpty(),
            check('monto', 'El monto es requerido').not().isEmpty(),
            check('tipoPromesa', 'El tipoPromesa es requerido').not().isEmpty(),
            check('tipo', 'El tipo es requerido').not().isEmpty(),
            validarCampos
        ],
        botoneraController.promesa);

        router.post('/editaPromesa',
        [
            check('cliente', 'El cliente es requerido').not().isEmpty(),
            check('telefonoContacto', 'El telefono es requerido').not().isEmpty(),
            check('idTipificacion', 'La tipificacion es requerida').not().isEmpty(),
            check('gestor', 'El gestor es requerido').not().isEmpty(),
            check('fechaPromesa', 'El fechaPromesa es requerido').not().isEmpty(),
            check('monto', 'El monto es requerido').not().isEmpty(),
            check('autoriza', 'El autorizador es requerido').not().isEmpty(),
            check('idpromesa', 'El idpromesa es requerido').not().isEmpty(),
            validarCampos
        ],
        botoneraController.editaPromesa);

        router.post('/cancelaPromesa',
        [
            check('cliente', 'El cliente es requerido').not().isEmpty(),
            check('telefonoContacto', 'El telefono es requerido').not().isEmpty(),
            check('gestor', 'El gestor es requerido').not().isEmpty(),
            check('autoriza', 'El autorizador es requerido').not().isEmpty(),
            check('idpromesa', 'El idpromesa es requerido').not().isEmpty(),
            check('idTipificacion', 'El idTipificacion es requerido').not().isEmpty(),
            validarCampos
        ],
        botoneraController.cancelaPromesa);
        
        router.post('/cancelaConvenios',
            [
                check('cliente', 'El cliente es requerido').not().isEmpty(),
                check('gestor', 'El gestor es requerido').not().isEmpty(),
                check('autoriza', 'El autorizador es requerido').not().isEmpty(),
                check('idTipificacion', 'El idTipificacion es requerido').not().isEmpty(),
                validarCampos
            ],
            botoneraController.cancelaConvenio);


        router.post('/insertaConvenio',
        [
            check('cliente', 'El cliente es requerido').not().isEmpty(),
            check('telefonoContacto', 'El telefono es requerido').not().isEmpty(),
            check('idTipificacion', 'La tipificacion es requerida').not().isEmpty(),
            check('gestor', 'El gestor es requerido').not().isEmpty(),
            check('montoCalcular', 'El montoCalcular es requerido').not().isEmpty(),
            check('fechaPagoInicial', 'La fechaPagoInicial es requerida').not().isEmpty(),
            check('montoPagoInicial', 'El montoPagoInicial es requerido').not().isEmpty(),
            check('numeroPagos', 'El numeroPagos es requerido').not().isEmpty(),
            check('detalleConvenio', 'El detalleConvenio es requerido').not().isEmpty(),
            check('tipo', 'El tipo es requerido').not().isEmpty(),
            validarCampos
        ],
        botoneraController.convenio);


/** Menus */

router.get('/seguimientos',
        auth,
        menusController.seguimientos
    );
 
    router.post('/pagosComisiones/',

    menusController.pagosComisiones
    ); 

    router.get('/pagosComisiones/:opcion/:semana/:anio/:gestor',

    menusController.pagosComisionesGet
    ); 

    router.get('/desactivar-promesas',
    auth,
    authGerente,
    menusController.desactivarPromesas
    ); 

    router.post('/desactivar-promesas',
    auth,
    authGerente,
    menusController.desactivarPromesasMasivo
    ); 


router.post('/desactivaSeguimiento',
        [
            check('id', 'El id es requerido').not().isEmpty(),
            check('tipo', 'La tipo es requerida').not().isEmpty(),
            validarCampos
        ],auth,
        menusController.desactivaSeguimiento);

        router.post('/compara-agente',
        auth,
        menusController.comparativopromesasxagente);

        router.post('/competitividad',
        auth,
        menusController.competitividad);


    /** INTERACCIONES CAME **/
    router.get('/interacciones/came/:id_socio', interacionesCameController.mostrarInteracionesCliente);
    router.post('/interacciones/came',
        [
            check('id_socio', 'El id_socio es requerido').not().isEmpty(),
            check('fecha_gestion', 'La fecha de gestion es requerida').not().isEmpty(),
            check('telefono_contacto', 'El telefono es requerido').not().isEmpty(),
            check('tipo_telefono', 'El tipo telefono es requerida').not().isEmpty(),
            check('id_tipificacion', 'La tipificacion es requerida').not().isEmpty(),
            check('gestor', 'El gestor es requerido').not().isEmpty(),
            validarCampos
        ],
        interacionesCameController.nuevaInteraccion
    );

    /** PROMESAS PAGO CAME**/
    router.get('/promesas-pago/came/:id_socio', promesasPagoCameController.mostrarPromesas);
    router.get('/promesas-pago/came/buscar/:id_promesa', promesasPagoCameController.obtenerPromesa);
    router.post('/promesas-pago/came/',
        [
            check('id_interaccion', 'La tipificacion es requerida').not().isEmpty(),
            check('id_socio', 'El cliente es requerido').not().isEmpty(),
            check('fecha_gestion', 'La fecha de gestion es requerida').not().isEmpty(),
            check('telefono_contacto', 'El telefono es requerido').not().isEmpty(),
            check('tipo_telefono', 'El tipo_telefono es requerida').not().isEmpty(),
            check('id_tipificacion', 'El id_tipificacion es requerido').not().isEmpty(),
            check('gestor', 'El gestor es requerido').not().isEmpty(),
            check('fecha_promesa', 'La fecha de promesa es requerida').not().isEmpty(),
            check('fecha_promesa', 'La fecha de promesa no es valida').isDate(),
            check('monto', 'El monto de la promesa es requerida').not().isEmpty(),
            check('monto', 'El monto de la promesa debe se mayor a 0').isFloat({ min: .1 }),
            validarCampos
        ], promesasPagoCameController.nuevaPromesaPago);

    router.patch('/actualiza-promesa/came', authGerente, promesasPagoCameController.actualizar_promesa);

    /** PAGOS CAME **/
    router.get('/pagos/came/:id_socio', pagosCameController.mostrarPagosCliente);
    router.get('/pagos/came', pagosCameController.mostrarPagosCompletos);

    router.post('/pagos/came', [
        check('id_interaccion', 'La tipificacion es requerida').not().isEmpty(),
        check('id_socio', 'El cliente es requerido').not().isEmpty(),
        check('fecha_gestion', 'La fecha de gestion es requerida').not().isEmpty(),
        check('gestor', 'El gestor es requerido').not().isEmpty(),
        check('fecha_pago', 'La fecha de promesa es requerida').not().isEmpty(),
        check('fecha_pago', 'La fecha de promesa no es valida').isDate(),
        check('tipo_pago', 'El tipo de pago es requerido').not().isEmpty(),
        check('tipo_contacto', 'El tipo_contacto es requerido').not().isEmpty(),
        check('monto', 'El monto de la promesa debe se mayor a 0').isFloat({ min: .1 }),
        validarCampos
    ], pagosCameController.nuevoPago);



    // /*  acciones  */
    router.get('/acciones', accionesController.mostrarAccionesClientes);


    //Promesas pago
    router.get('/promesas-pago/banco_azteca/:cliente_unico', promesasPagoController.mostrarPromesas);
    router.get('/promesas-pago/banco_azteca/buscar/:id_promesa', promesasPagoController.obtenerPromesa);
    router.post('/promesas-pago/banco_azteca',
        [
            check('id_interaccion', 'La tipificacion es requerida').not().isEmpty(),
            check('cliente_unico', 'El cliente es requerido').not().isEmpty(),
            check('fecha_gestion', 'La fecha de gestion es requerida').not().isEmpty(),
            check('telefono_contacto', 'El telefono es requerido').not().isEmpty(),
            check('tipo_telefono', 'El tipo_telefono es requerida').not().isEmpty(),
            check('id_tipificacion', 'El id_tipificacion es requerido').not().isEmpty(),
            check('gestor', 'El gestor es requerido').not().isEmpty(),
            check('fecha_promesa', 'La fecha de promesa es requerida').not().isEmpty(),
            check('fecha_promesa', 'La fecha de promesa no es valida').isDate(),
            check('monto', 'El monto de la promesa es requerida').not().isEmpty(),
            check('monto', 'El monto de la promesa debe se mayor a 0').isFloat({ min: .1 }),
            validarCampos
        ], promesasPagoController.nuevaPromesaPago);

    router.patch('/actualiza-promesa/banco_azteca', authGerente, promesasPagoController.actualizar_promesa);


    // //Pagos
    router.get('/pagos/banco_azteca/:cliente_unico', pagosController.mostrarPagosCliente);
    router.get('/pagos/banco_azteca', pagosController.mostrarPagosCompletos);

    router.post('/pagos/banco_azteca', [
        check('id_interaccion', 'La tipificacion es requerida').not().isEmpty(),
        check('cliente_unico', 'El cliente es requerido').not().isEmpty(),
        check('fecha_gestion', 'La fecha de gestion es requerida').not().isEmpty(),
        check('gestor', 'El gestor es requerido').not().isEmpty(),
        check('fecha_pago', 'La fecha de promesa es requerida').not().isEmpty(),
        check('fecha_pago', 'La fecha de promesa no es valida').isDate(),
        check('tipo_pago', 'El tipo de pago es requerido').not().isEmpty(),
        check('tipo_contacto', 'El tipo_contacto es requerido').not().isEmpty(),
        check('monto', 'El monto de la promesa debe se mayor a 0').isFloat({ min: .1 }),
        validarCampos
    ], pagosController.nuevoPago);

    //tipificaciones
    router.get('/tipificaciones/banco-azteca', tipificacionesController.mostrarTipificaciones);
    router.get('/tipificaciones', tipificacionesController.mostrarTipificaciones);

   
    // //Clientes banco azteca
    // router.get('/clientes-banco-azteca/:cliente_unico',clientesBancoAztecaController.obtenerCliente );
    // router.post('/clientes-banco-azteca', auth ,clientesBancoAztecaController.nuevoCliente );


    router.get('/clientes', clientesController.obtenerCliente);
    router.get('/clientesfront', clientesController.obtenerClienteFront);
    router.get('/gestionesCredito', clientesController.gestionesCredito);
    router.get('/gestionesCreditoResumen', clientesController.gestionesCreditoResumen);

    router.get('/getPromesasCliente', clientesController.getPromesasCliente);


    // router.get('/clientes-test', clientesController.obtenerClienteTest);

    // Reporte
    router.get('/reporte/promesa-pago', ReportesController.reportePromesasPagos);
    router.get('/reporte/excel/promesas-pago', ReportesController.generarExcelPromesasPago);
    router.get('/reporte/pagos', ReportesController.reportePagos);
    router.get('/reporte/excel/pagos', ReportesController.generarExcelPago);
    router.get('/reporte/tipificaciones', ReportesController.reporteTipificaciones);
    router.get('/reporte/excel/tipificaciones', ReportesController.generarExcelInteraciones);
    
    router.get('/reporte/gestiones', ReportesController.reporteGestiones);
    

    // Carteo
    router.get('/carteo/filtros', CarteoController.getFiltrosForAzteca);
    router.post('/carteo/cambiarImg', CarteoController.cambiarImgsPlantilla);
    router.post('/carteo/editarBody', CarteoController.modificarBodyPlantilla);

    router.get('/carteo/pdf/banco_azteca', CarteoController.generarPDFAzteca);
    router.get('/carteo/pdf/came', CarteoController.generarPDFCame);
    router.get('/carteo/pdf/apoyo_economico', CarteoController.generarPDFApoyo);
    
    router.get('/carteo/utilies/:img', CarteoController.getImagenPlantilla);
    router.get('/carteo/plantillas/:id_firma', CarteoController.getPlantillas);
    router.get('/carteo/plantillas/:id_firma/:id_plantilla', CarteoController.getPlantilla);
    
    // Convenios 
     //router.get('/convenio/:firma', ConveniosController.getConvenios);
     router.get('/convenio/:firma/:id_cliente', ConveniosController.getConvenioByClienteUnico);
     router.get('/convenio/:cliente',botoneraController.getconvenio);
     router.post('/convenio', ConveniosController.nuevoConvenio);
 
    // Pagos convenio
    router.post('/convenioPago', pagosConveioController.nuevoPagoConvenio);
    router.get('/img/convenioPagos/:img', pagosConveioController.renderImg);

    //menu
    router.get('/menu', auth, menuController.mostrarMenu);

    //estado portafolio
    router.get('/getEstadoPortafolio', ReportesController.getEstadoPortafolio);

    // Busqueda manual
    router.get('/busqueda-manual', busquedaManualController.busquedaManualIn);
    router.get('/busqueda-movil', clientesController.busquedaClientes);
    router.get('/busqueda-clientes-bitacora', auth, busquedaManualController.obtieneClientes);
    //router.get('/busqueda-clientes-bitacora', auth, busquedaManualController.obtenerClientesBitacora);

    // router.get('/busqueda-clientes-bitacora-test', auth, busquedaManualController.obtenerClientesBitacoraTest);

 //valida Telefono
 router.get('/validaTelefono',  validaTelefonoController.validaTelefono);
    //
    router.post('/cargas-masivas-clientes',
        auth,
        authGerente,
        uploadCSVFile,
        cargasClientesController.masivosClientes
    );

    router.post('/cargas-pagos-scl',
    auth,
    authGerente,
    uploadCSVFile,
    cargasPagosController.pagosClientes
);

router.get('/registros-scl',
auth,
authGerente,
cargasPagosController.getPagosSCL
);


router.post('/delete-pagosscl',
auth,
authGerente,
cargasPagosController.deleteMasivosSCL
);



router.post('/masivosGestiones',
    auth,
    authGerente,
    uploadCSVFile,
    masivosGestionesController.masivosGestiones
);

router.post('/elimina-masivosGestiones',
    auth,
    authGerente,
    masivosGestionesController.eliminaMasivoGestion
);

//*********************masivos demandas************++ */

router.post('/masivosDemandas',
    auth,
    authGerente,
    uploadCSVFile,
    cargasClientesController.masivosDemandas
);
 
router.get('/demandas',
    auth,
    authGerente,
    cargasClientesController.getDemandas
    );

router.post('/delete-demandas',
    auth,
    authGerente,
    cargasClientesController.deleteDemandas
    );
        
    router.get('/smsmasivos',
        auth,
        authGerente,
        cargasClientesController.getSMSMasivos
        );
            
//*************************************************** */
//****************************RDM********************** */



router.post('/masivosRDM',
    auth,
    authGerente,
    uploadCSVFile,
    cargasClientesController.masivosRDM
);
 
router.get('/RDM',
    auth,
    authGerente,
    cargasClientesController.getRDM
    );

router.post('/delete-RDM',
    auth,
    authGerente,
    cargasClientesController.deleteRDM
    );


    /******************************************* */

    router.post('/insertaPago',
        uploadImageFile,
        botoneraController.registraPago
    );

      //
    router.post('/inserta-masivo',
      
      cargasClientesFrontController.masivosClientes
     );

    router.post('/registraNumAdicional',
            
       registraNumeroController.registraNumero
    );

    router.post('/listaNegra',
            
    registraListaNegra.registraNumero
 );

 router.post('/sacaListaNegra',
            
 registraListaNegra.eliminaNumero
);

router.post('/ingresaDemanda',
            
    accionesController.registraNumero
 );

 router.post('/eliminaDemanda',
            
    accionesController.eliminaNumero
);




    // AGENDA PROMESAS
    router.get('/agenda-promesas', auth, agendaPromesasController.mostrarMisPromesas);
    router.get('/resumenPromesas', auth, agendaPromesasController.resumenPromesas);

    /** Firmas **/
    router.get('/firmas',
        auth,
        authGerente,
        firmasController.obtenerFirmas
    );


    /** Productos **/
    router.get('/productos/:id_firma',
        auth,
        authGerente,
        productosController.obtenerProductosFirma
    );


    router.get('/reportes/:id_firma',
    auth,
    authGerente,
    ReportesController.obtenerReportesXFirma
);


    router.post('/productos',
        auth,
        authGerente,
        productosController.crearProducto
    );

    router.patch('/productos',
        auth,
        authGerente,
        productosController.actualizarProducto
    )


    router.get('/', (req, res) => {
        res.json({
            msg: 'epker-api'
        })
    });




    /** INTERACCIONES APOYO ECONOMICO **/
    router.get('/interacciones/apoyo_economico/:operacionesid', interacionesApoyoEconomicoController.mostrarInteracionesCliente);
    router.post('/interacciones/apoyo_economico',
        [
            check('operacionesid', 'El operacionesid es requerido').not().isEmpty(),
            check('fecha_gestion', 'La fecha de gestion es requerida').not().isEmpty(),
            check('telefono_contacto', 'El telefono es requerido').not().isEmpty(),
            check('tipo_telefono', 'El tipo telefono es requerida').not().isEmpty(),
            check('id_tipificacion', 'La tipificacion es requerida').not().isEmpty(),
            check('gestor', 'El gestor es requerido').not().isEmpty(),
            validarCampos
        ],
        interacionesApoyoEconomicoController.nuevaInteraccion
    );

    /** PROMESAS PAGO APOYO ECONOMICO**/
    router.get('/promesas-pago/apoyo_economico/:operacionesid', promesasPagoApoyoEconomicoController.mostrarPromesas);
    router.get('/promesas-pago/apoyo_economico/buscar/:id_promesa', promesasPagoApoyoEconomicoController.obtenerPromesa);
    router.post('/promesas-pago/apoyo_economico',
        [
            check('id_interaccion', 'La tipificacion es requerida').not().isEmpty(),
            check('operacionesid', 'El cliente es requerido').not().isEmpty(),
            check('fecha_gestion', 'La fecha de gestion es requerida').not().isEmpty(),
            check('telefono_contacto', 'El telefono es requerido').not().isEmpty(),
            check('tipo_telefono', 'El tipo_telefono es requerida').not().isEmpty(),
            check('id_tipificacion', 'El id_tipificacion es requerido').not().isEmpty(),
            check('gestor', 'El gestor es requerido').not().isEmpty(),
            check('fecha_promesa', 'La fecha de promesa es requerida').not().isEmpty(),
            check('fecha_promesa', 'La fecha de promesa no es valida').isDate(),
            check('monto', 'El monto de la promesa es requerida').not().isEmpty(),
            check('monto', 'El monto de la promesa debe se mayor a 0').isFloat({ min: .1 }),
            validarCampos
        ], promesasPagoApoyoEconomicoController.nuevaPromesaPago);

    router.patch('/actualiza-promesa/apoyo_economico', authGerente, promesasPagoApoyoEconomicoController.actualizar_promesa);

    /** PAGOS APOYO ECONOMICO **/
    router.get('/pagos/apoyo_economico/:id_socio', pagosApoyoEconomicoController.mostrarPagosCliente);
    router.get('/pagos/apoyo_economico', pagosApoyoEconomicoController.mostrarPagosCompletos);

    router.post('/pagos/apoyo_economico', [
        check('id_interaccion', 'La tipificacion es requerida').not().isEmpty(),
        check('operacionesid', 'El cliente es requerido').not().isEmpty(),
        check('fecha_gestion', 'La fecha de gestion es requerida').not().isEmpty(),
        check('gestor', 'El gestor es requerido').not().isEmpty(),
        check('fecha_pago', 'La fecha de promesa es requerida').not().isEmpty(),
        check('fecha_pago', 'La fecha de promesa no es valida').isDate(),
        check('tipo_pago', 'El tipo de pago es requerido').not().isEmpty(),
        check('tipo_contacto', 'El tipo_contacto es requerido').not().isEmpty(),
        check('monto', 'El monto de la promesa debe se mayor a 0').isFloat({ min: .1 }),
        validarCampos
    ], pagosApoyoEconomicoController.nuevoPago);

    router.get('/roles',
        auth,
        authGerente,
        rolesController.mostrarRoles
    );

    router.patch('/clientes',
        auth,
        authGerente,
        clientesController.activarCliente
    );

    router.post('/sms/manual',
        auth,
        [

            check('telefono', 'El teléfono es requerido.').not().isEmpty(),
            check('mensaje', 'El mensaje es requerido.').not().isEmpty(),
            validarCampos
        ],
        smsController.smsManual
    );

    /** reportes masivos Blaster **/
    router.get('/reportes/blaster/cargas', 
    auth,
    authGerente,
    blasterMasivoController.obtieneCargas );

    router.get('/reportes/blaster/:id_carga/agrupado', 
    auth,
    authGerente,
    blasterMasivoController.agrupadoBlaster );

    // router.get('/reportes/blaster/:id_carga/detalle', 
    // auth,
    // authGerente,
    // blasterMasivoController.detalleBlaster );

    router.get('/reportes/blaster/:id_carga/exportar', 
    auth,
    authGerente,
    blasterMasivoController.detalleBlaster );

    
    /** reportes masivos SMS **/
    router.get('/reportes/sms/cargas', 
    auth,
    authGerente,
    smsMasivoController.obtenerCargasSms );

    router.get('/reportes/sms/:id_carga/agrupado', 
    auth,
    authGerente,
    smsMasivoController.agrupadoCargaSms );

    router.get('/reportes/sms/:id_carga/exportar', 
    auth,
    authGerente,
    smsMasivoController.detalleCargaSms );

    router.get('/email/plantillas/:usuario', 
    auth,
    authGerente,
    emailMasivoController.obtenerEmails );


    router.get('/blaster/lotes', 
    auth,
    authGerente,
    blasterMasivoController.obtenerLotes );


    router.get('/reportes/email/cargas', 
    auth,
    authGerente,
    emailMasivoController.obtenerCargasEmail );


    router.get('/reportes/email/:id_carga/agrupado', 
    auth,
    authGerente,
    emailMasivoController.agrupadoCargaEmail );
    
    router.get('/reportes/email/:id_carga/exportar', 
    auth,
    authGerente,
    emailMasivoController.detalleCargaEmail );


    router.post('/gestion-manual-filtro',
        auth,
        [

            check('firma', 'la firma es requerida.').not().isEmpty(),
            check('productoCliente', 'El producto es requerido.').not().isEmpty(),
            validarCampos
        ],
        gestionManualController.filtroGestionManual
    );

    router.post('/gestion-manual-obtienefiltro',
         [

            check('firma', 'la firma es requerida.').not().isEmpty(),
            check('productoCliente', 'El producto es requerido.').not().isEmpty(),
            validarCampos
        ],
        gestionManualController.obtieneFiltros
    );

    router.post('/gestion-manual-asignacion',
        auth,
        [
            check('firma', 'la firma es requerida.').not().isEmpty(),
            check('productoCliente', 'El producto es requerido.').not().isEmpty(),
            check('gestores', 'los agentes son requeridos.').not().isEmpty(),
            validarCampos
        ],
        gestionManualController.asignacionManual
    );


    router.get('/obtieneUsuariosActivos',

       usuarioController.obtieneUsuarios
        ); 


        router.get('/getAsignacionXAgente',
            auth,
            gestionManualController.getAsignacionXAgente
             ); 
            
             router.get('/obtieneAsignacion/:idAsignacion',
                auth,
                gestionManualController.obtieneAsignacion
            );
            
            router.get('/getTelefonosAdicionales/:cliente',
                auth,
                clientesBancoAztecaController.getTelefonosAdic
                 ); 

            

    return router;
}
