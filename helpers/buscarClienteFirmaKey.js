
const Sequelize =  require('sequelize');
const clientesApoyoEconomico = require("../models/clientes-apoyo-economico.model");
const ClientesBancoAzteca = require("../models/clientes-banco-azteca.model");
const ClientesCamel = require("../models/clientes-camel.model");
const Firma = require("../models/firma.model");
const Productos = require("../models/productos.model");
const PromesasPagoApoyoEconomico = require("../models/promesas-pago-apoyo-economico.model");
const PromesasPagoCame = require("../models/promesas-pago-came.model");
const PromesasPago = require("../models/promesas-pago.model");

const buscarClienteFirmaKey = async ({ firma_cliente = '', key = '' }) => {

	if (key =='' || firma_cliente == '') {
		return {}
	}

	try {
		switch (firma_cliente) {
			//banco azteca
			case 'banco_azteca':
				return [{
					cliente: await ClientesBancoAzteca.findOne({
						where: {
							cliente_unico: key
						},
						include: [
							{
								model: PromesasPago,
								where: {
									estatus: 'proceso'
								},
								required : false
							},
							{
								model: Firma,
								attributes: ['nombre'],
								as : "firmaa"
							},
							{
								model: Productos,
								attributes: ['nombre_producto'],
								as : 'producto_banco_azteca'
							}
						],
						attributes : [
							...Object.keys(ClientesBancoAzteca.rawAttributes) ,
							[Sequelize.literal('"firmaa"."nombre"'), "nombre_firma"],
							[Sequelize.literal('"producto_banco_azteca"."nombre_producto"'), "nombre_producto"]
						]
					}),
					firma: 'Banco_Azteca'
				}];


			//Came
			case 'came':
				return [
					{
						cliente: await ClientesCamel.findOne({
							where: {
								id_socio: key
							},
							include: [
								{
									model: PromesasPagoCame,
									where: {
										estatus: 'proceso'
									},
									required : false
								},
								{
									model: Firma,
									attributes: ['nombre'],
									as : "firma_came"
								},
								{
									model: Productos,
									attributes: ['nombre_producto'],
									as : 'producto_came'
								}
							],
							attributes : [
								...Object.keys(ClientesCamel.rawAttributes)  ,
								[Sequelize.literal('"firma_came"."nombre"'), "nombre_firma"],
								[Sequelize.literal('"producto_came"."nombre_producto"'), "nombre_producto"]
							]
						}),
						firma: 'Camel'
					}
				];

			//APRECIA
			case 'APRECIA':
							return [{
								cliente: await ClientesBancoAzteca.findOne({
									where: {
										cliente_unico: key
									},
									include: [
										{
											model: PromesasPago,
											where: {
												estatus: 'proceso'
											},
											required : false
										},
										{
											model: Firma,
											attributes: ['nombre'],
											as : "firmaa"
										},
										{
											model: Productos,
											attributes: ['nombre_producto'],
											as : 'producto_banco_azteca'
										}
									],
									attributes : [
										...Object.keys(ClientesBancoAzteca.rawAttributes) ,
										[Sequelize.literal('"firmaa"."nombre"'), "nombre_firma"],
										[Sequelize.literal('"producto_banco_azteca"."nombre_producto"'), "nombre_producto"]
									]
								}),
								firma: 'Banco_Azteca'
							}];
				//MAGAL
				case 'MAGAL':
					return [{
						cliente: await ClientesBancoAzteca.findOne({
							where: {
								cliente_unico: key
							},
							include: [
								{
									model: PromesasPago,
									where: {
										estatus: 'proceso'
									},
									required : false
								},
								{
									model: Firma,
									attributes: ['nombre'],
									as : "firmaa"
								},
								{
									model: Productos,
									attributes: ['nombre_producto'],
									as : 'producto_banco_azteca'
								}
							],
							attributes : [
								...Object.keys(ClientesBancoAzteca.rawAttributes) ,
								[Sequelize.literal('"firmaa"."nombre"'), "nombre_firma"],
								[Sequelize.literal('"producto_banco_azteca"."nombre_producto"'), "nombre_producto"]
							]
						}),
						firma: 'Banco_Azteca'
					}];
			//COVEYP
			case 'COVEYP':
							return [{
								cliente: await ClientesBancoAzteca.findOne({
									where: {
										cliente_unico: key
									},
									include: [
										{
											model: PromesasPago,
											where: {
												estatus: 'proceso'
											},
											required : false
										},
										{
											model: Firma,
											attributes: ['nombre'],
											as : "firmaa"
										},
										{
											model: Productos,
											attributes: ['nombre_producto'],
											as : 'producto_banco_azteca'
										}
									],
									attributes : [
										...Object.keys(ClientesBancoAzteca.rawAttributes) ,
										[Sequelize.literal('"firmaa"."nombre"'), "nombre_firma"],
										[Sequelize.literal('"producto_banco_azteca"."nombre_producto"'), "nombre_producto"]
									]
								}),
								firma: 'Banco_Azteca'
							}];



			//Apoyo economico
			case 'apoyo_economico':
				return [
					{
						cliente: await clientesApoyoEconomico.findOne({
							where: {
								operacionesid: key
							},
							include: [
								{
									model: PromesasPagoApoyoEconomico,
									where: {
										estatus: 'proceso'
									},
									required : false
								},
								{
									model: Firma,
									attributes: ['nombre'],
									as : "firma_apoyo_economico"
								},
								{
									model: Productos,
									attributes: ['nombre_producto'],
									as : 'producto_apoyo_economico'
								}
							],
							attributes : [
								...Object.keys(clientesApoyoEconomico.rawAttributes)  ,
								[Sequelize.literal('"firma_apoyo_economico"."nombre"'), "nombre_firma"],
								[Sequelize.literal('"producto_apoyo_economico"."nombre_producto"'), "nombre_producto"]
							]
						}),
						firma: 'Apoyo_Economico'
					}
				];

			default:
				return []
		}
	} catch (error) {

		console.error(error);

		return []

	}
};


module.exports = buscarClienteFirmaKey;