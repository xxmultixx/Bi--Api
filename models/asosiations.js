const clientesApoyoEconomico = require("./clientes-apoyo-economico.model");
const ClientesBancoAzteca = require("./clientes-banco-azteca.model");
const ClientesCamel = require("./clientes-camel.model");
const ConveniosBancoAzteca = require("./convenios-banco-azteca.model");
const ConvenioPago = require("./convenioPago.model");
const DetallePermisos = require("./detalles-permisos.model");
const Firma = require("./firma.model");
const LogPromesasApoyoEconomico = require("./log-promesas-apoyo_economico.model");
const LogPromesasBancoAzteca = require("./log-promesas-banco-azteca.model");
const LogPromesasCame = require("./log-promesas-came.model");
const PagosSinPromesa = require("./pago-sin-promesa.model");
const PagosApoyoEconomico = require("./pagos-apoyo-economico.model");
const PagosCame = require("./pagos-came.model");
const PagosSinPromesaApoyoEconomico = require("./pagos-sin-promesa-apoyo-economico.model");
const Pagos = require("./pagos.model");
const PermisosRoles = require("./permisos-roles.model");
const Permisos_section = require("./permisos-secciones.model");
const Permisos = require("./permisos.model");
const Productos = require("./productos.model");
const PromesasPagoApoyoEconomico = require("./promesas-pago-apoyo-economico.model");
const PromesasPagoCame = require("./promesas-pago-came.model");
const PromesasPago = require("./promesas-pago.model");
const Roles = require("./roles.model");
const Grupos = require("./grupos.model");
const Tipificaciones = require("./tipificaciones.model");
const Usuarios = require("./usuarios.model");
const Interaciones = require("./interaciones.model");
const InteracionesCame = require("./interacciones-came.model");
const InteracionesApoyoEconomico = require("./interacciones-apoyo-economico.model");

Roles.hasMany(Usuarios, { foreignKey: 'id_role' , onDelete : 'NO ACTION'});
Usuarios.belongsTo(Roles, {foreignKey : 'id_role', onDelete : 'NO ACTION'});

Grupos.hasMany(Usuarios, { foreignKey: 'idGrupo' , onDelete : 'NO ACTION'});
Usuarios.belongsTo(Grupos, {foreignKey : 'idGrupo', onDelete : 'NO ACTION'});

Tipificaciones.hasMany(PromesasPago,{foreignKey : 'id_tipificacion' , onDelete : 'NO ACTION'});
PromesasPago.belongsTo(Tipificaciones, {foreignKey : 'id_tipificacion' , onDelete : 'NO ACTION'});

ClientesBancoAzteca.hasMany( PromesasPago , { foreignKey : 'cliente_unico' ,  foreignKeyConstraint: true ,  onDelete : 'NO ACTION'});
PromesasPago.belongsTo( ClientesBancoAzteca , { foreignKey : 'cliente_unico' , foreignKeyConstraint: true ,  onDelete : 'NO ACTION'});

PromesasPago.hasMany( Pagos ,  { foreignKey : 'id_promesa' , foreignKeyConstraint: true ,  onDelete : 'NO ACTION'});
Pagos.belongsTo( PromesasPago , { foreignKey : 'id_promesa'  , foreignKeyConstraint: true ,  onDelete : 'NO ACTION'});

ClientesBancoAzteca.hasMany(Pagos, { foreignKey: 'cliente_unico'  });
Pagos.belongsTo(ClientesBancoAzteca, { foreignKey: 'cliente_unico' });

Firma.hasMany( Productos , {foreignKey : 'id_firma'  , onDelete : 'NO ACTION'}); 
Productos.belongsTo( Firma , {foreignKey : 'id_firma'  , onDelete : 'NO ACTION'});


ClientesCamel.hasMany( PromesasPagoCame , { foreignKey : 'id_socio'  , onDelete : 'NO ACTION'});
PromesasPagoCame.belongsTo( ClientesCamel , { foreignKey : 'id_socio'  , onDelete : 'NO ACTION'});

clientesApoyoEconomico.hasMany( PromesasPagoApoyoEconomico , { foreignKey : 'operacionesid'  , onDelete : 'NO ACTION'});
PromesasPagoApoyoEconomico.belongsTo( clientesApoyoEconomico , { foreignKey : 'operacionesid'  , onDelete : 'NO ACTION'});

Firma.hasMany( ClientesBancoAzteca , {foreignKey : 'id_firma' , as: 'firmaa'  , onDelete : 'NO ACTION'});
ClientesBancoAzteca.belongsTo( Firma , {foreignKey : 'id_firma' , as: 'firmaa' , onDelete : 'NO ACTION'});

Firma.hasMany( ClientesCamel , {foreignKey : 'id_firma' , as: 'firma_came' , onDelete : 'NO ACTION'});
ClientesCamel.belongsTo( Firma , {foreignKey : 'id_firma' , as: 'firma_came' , onDelete : 'NO ACTION'});

Firma.hasMany( clientesApoyoEconomico , {foreignKey : 'id_firma' , as: 'firma_apoyo_economico' , onDelete : 'NO ACTION'});
clientesApoyoEconomico.belongsTo( Firma , {foreignKey : 'id_firma' , as: 'firma_apoyo_economico' , onDelete : 'NO ACTION'});

ClientesBancoAzteca.hasMany( PagosSinPromesa , { foreignKey : 'cliente_unico' , foreignKeyConstraint: true  , onDelete : 'NO ACTION'});
PagosSinPromesa.belongsTo( ClientesBancoAzteca , { foreignKey : 'cliente_unico'  , foreignKeyConstraint: true  , onDelete : 'NO ACTION'});


/* Came  */
ClientesCamel.hasMany( PagosCame , { foreignKey : 'id_socio'  ,  onDelete : 'NO ACTION'});
PagosCame.belongsTo( ClientesCamel , { foreignKey : 'id_socio'   ,  onDelete : 'NO ACTION'});

ClientesCamel.hasMany( PagosCame , { foreignKey : 'id_socio'  ,  onDelete : 'NO ACTION'});
PagosCame.belongsTo( ClientesCamel , { foreignKey : 'id_socio'   ,  onDelete : 'NO ACTION'});

Tipificaciones.hasMany(PromesasPagoCame,{foreignKey : 'id_tipificacion',  onDelete : 'NO ACTION'});
PromesasPagoCame.belongsTo(Tipificaciones, {foreignKey : 'id_tipificacion',  onDelete : 'NO ACTION'});

PromesasPagoCame.hasMany( PagosCame ,  { foreignKey : 'id_promesa' , onDelete : 'NO ACTION'  } );
PagosCame.belongsTo( PromesasPagoCame , { foreignKey : 'id_promesa'  , onDelete : 'NO ACTION'  });

/* apoyo economico */
clientesApoyoEconomico.hasMany( PagosApoyoEconomico , { foreignKey : 'operacionesid' , onDelete : 'NO ACTION'});
PagosApoyoEconomico.belongsTo( clientesApoyoEconomico , { foreignKey : 'operacionesid' , onDelete : 'NO ACTION'});

clientesApoyoEconomico.hasMany( PagosSinPromesaApoyoEconomico , { foreignKey : 'operacionesid' , onDelete : 'NO ACTION'});
PagosSinPromesaApoyoEconomico.belongsTo( clientesApoyoEconomico , { foreignKey : 'operacionesid' , onDelete : 'NO ACTION'});


Productos.hasMany( ClientesBancoAzteca , {foreignKey : 'producto_cliente',  as : 'producto_banco_azteca' , onDelete : 'NO ACTION'}) ; 
ClientesBancoAzteca.belongsTo( Productos , {foreignKey : 'producto_cliente' ,  as : 'producto_banco_azteca',  onDelete : 'NO ACTION'});

Productos.hasMany( ClientesCamel , {foreignKey : 'producto_cliente' , as : 'producto_came', onDelete : 'NO ACTION'}) ; 
ClientesCamel.belongsTo( Productos , {foreignKey : 'producto_cliente' , as : 'producto_came',onDelete : 'NO ACTION'});

Productos.hasMany( clientesApoyoEconomico , {foreignKey : 'producto_cliente'  ,as : 'producto_apoyo_economico',  onDelete : 'NO ACTION'}) ; 
clientesApoyoEconomico.belongsTo( Productos , {foreignKey : 'producto_cliente' , as : 'producto_apoyo_economico',  onDelete : 'NO ACTION'});


Tipificaciones.hasMany( PromesasPagoApoyoEconomico , { foreignKey : 'id_tipificacion' , onDelete : 'NO ACTION'});
PromesasPagoApoyoEconomico.belongsTo( Tipificaciones , { foreignKey : 'id_tipificacion' , onDelete : 'NO ACTION'});

PromesasPagoApoyoEconomico.hasMany( PagosApoyoEconomico , { foreignKey : 'id_promesa' , onDelete : 'NO ACTION'});
PagosApoyoEconomico.belongsTo( PromesasPagoApoyoEconomico , { foreignKey : 'id_promesa' , onDelete : 'NO ACTION'});


PromesasPago.hasMany( LogPromesasBancoAzteca , { foreignKey : 'id_promesa' , onDelete : 'NO ACTION' , as : 'log_promesa'});
LogPromesasBancoAzteca.belongsTo( PromesasPago , { foreignKey : 'id_promesa' , onDelete : 'NO ACTION' , as : 'log_promesa'});

PromesasPagoCame.hasMany( LogPromesasCame, { foreignKey : 'id_promesa' , onDelete : 'NO ACTION' , as : 'log_promesa'});
LogPromesasCame.belongsTo( PromesasPagoCame , { foreignKey : 'id_promesa' , onDelete : 'NO ACTION' , as : 'log_promesa'});

PromesasPagoApoyoEconomico.hasMany( LogPromesasApoyoEconomico, { foreignKey : 'id_promesa' , onDelete : 'NO ACTION' , as : 'log_promesa'});
LogPromesasApoyoEconomico.belongsTo( PromesasPagoApoyoEconomico , { foreignKey : 'id_promesa' , onDelete : 'NO ACTION' , as : 'log_promesa'});


Roles.hasMany( PermisosRoles, { foreignKey : 'id_role' , onDelete : 'NO ACTION' });
PermisosRoles.belongsTo( Roles , { foreignKey : 'id_role' , onDelete : 'NO ACTION' });
 
PermisosRoles.hasMany( DetallePermisos, { foreignKey : 'id_permiso' , onDelete : 'NO ACTION' });
DetallePermisos.belongsTo( PermisosRoles , { foreignKey : 'id_permiso' , onDelete : 'NO ACTION' });

Permisos.hasMany( PermisosRoles, { foreignKey : 'id_permiso' , onDelete : 'NO ACTION' });
PermisosRoles.belongsTo( Permisos , { foreignKey : 'id_permiso' , onDelete : 'NO ACTION' });

Permisos.hasMany( DetallePermisos, { foreignKey : 'id_permiso' , onDelete : 'NO ACTION' });
DetallePermisos.belongsTo( Permisos , { foreignKey : 'id_permiso' , onDelete : 'NO ACTION' });


//? Relaciones para las iteraciones -- banco azteca
Tipificaciones.hasMany( Interaciones, { foreignKey: 'id_tipificacion',  onDelete: 'NO ACTION' } );
Interaciones.belongsTo( Tipificaciones, { foreignKey: 'id_tipificacion',  onDelete: 'NO ACTION' } );

ClientesBancoAzteca.hasMany(Interaciones, { foreignKey: 'cliente_unico', as: 'cliente' });
Interaciones.belongsTo(ClientesBancoAzteca, { foreignKey: 'cliente_unico', as: 'cliente' });

//? Relaciones para las iteraciones -- camel
Tipificaciones.hasMany( InteracionesCame, { foreignKey: 'id_tipificacion',  onDelete: 'NO ACTION' } );
InteracionesCame.belongsTo( Tipificaciones, { foreignKey: 'id_tipificacion',  onDelete: 'NO ACTION' } );

ClientesCamel.hasMany(InteracionesCame, { foreignKey: 'id_socio', as: 'cliente' });
InteracionesCame.belongsTo(ClientesCamel, { foreignKey: 'id_socio', as: 'cliente' });

//? Relaciones para las iteraciones -- apoyo
Tipificaciones.hasMany( InteracionesApoyoEconomico, { foreignKey: 'id_tipificacion',  onDelete: 'NO ACTION' } );
InteracionesApoyoEconomico.belongsTo( Tipificaciones, { foreignKey: 'id_tipificacion',  onDelete: 'NO ACTION' } );

clientesApoyoEconomico.hasMany(InteracionesApoyoEconomico, { foreignKey: 'operacionesid', as: 'cliente' });
InteracionesApoyoEconomico.belongsTo(clientesApoyoEconomico, { foreignKey: 'operacionesid', as: 'cliente' });


// Convenios y pagosConvenios
ConveniosBancoAzteca.hasMany( ConvenioPago, { foreignKey : 'id_convenio' , foreignKeyConstraint: true , onDelete : 'NO ACTION'});
ConvenioPago.belongsTo( ConveniosBancoAzteca, { foreignKey : 'id_convenio' , foreignKeyConstraint: true , onDelete : 'NO ACTION'});

// Saber la info del cliente a la que pertenece el convenio.
ClientesBancoAzteca.hasMany(ConveniosBancoAzteca, { foreignKey : 'cliente_unico' , foreignKeyConstraint: true });
ConveniosBancoAzteca.belongsTo(ClientesBancoAzteca, { foreignKey : 'cliente_unico' , foreignKeyConstraint: true });

ConveniosBancoAzteca.belongsTo(ClientesBancoAzteca, { foreignKey : 'cliente_unico' , foreignKeyConstraint: true });