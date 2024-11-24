
const Sequelize = require('sequelize');
const {Op} = require('sequelize'); 
const clientesApoyoEconomico = require("../models/clientes-apoyo-economico.model");
const ClientesBancoAzteca = require("../models/clientes-banco-azteca.model");
const ClientesCamel = require("../models/clientes-camel.model");
const Firma = require("../models/firma.model");
const Productos = require("../models/productos.model");
const PromesasPagoApoyoEconomico = require("../models/promesas-pago-apoyo-economico.model");
const PromesasPagoCame = require("../models/promesas-pago-came.model");
const PromesasPago = require("../models/promesas-pago.model");

const buscarClienteIn = async ({ firma_cliente = '', cliente = null, dnis = null, nombre = null }) => {

	const response = [];

	const querys = [

		// Buscar el cliente en banco azteca por el id ó los telefonos
		ClientesBancoAzteca.findAll({
			where: {
				[Sequelize.Op.and]: [
					cliente && { cliente_unico: { [Op.like]: `%${cliente}%` } },
					dnis && {
						[Sequelize.Op.or]: [
							{ 'telefono1': { [Op.like]: `%${dnis}%` }  },
							{ 'telefono2': { [Op.like]: `%${dnis}%` } },
							{ 'telefono3': { [Op.like]: `%${dnis}%` } },
							{ 'telefono4': { [Op.like]: `%${dnis}%` } },
						]
					},
					nombre && {
						nombre_cte: { [Op.like]: `%${nombre}%` }
					}
				]
			},
			include: [
				{
					model: PromesasPago,
					where: { estatus: 'proceso' },
					attributes: [
						'id_promesa',
						[Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa']
					],
					required: false
				},
				{
					model: Firma,
					attributes: ['nombre'],
					include: [
						{
							model: Productos,
							attributes: ['nombre_producto']
						}
					],
					as: 'firmaa'
				}
			],
			attributes : [
				...Object.keys(ClientesBancoAzteca.rawAttributes) ,
				[Sequelize.literal('"firmaa"."nombre"'), "nombre_firma"]
			]
		}),

		// Buscar el cliente en apoyo economico por el id ó los telefonos
		clientesApoyoEconomico.findAll({

			where: {
				[Sequelize.Op.and]: [
					cliente && { operacionesid: { [Op.like]: `%${cliente}%` } },
					dnis && {
						[Sequelize.Op.or]: [
							{ 'tel1': { [Op.like]: `%${dnis}%` } },
							{ 'tel2': { [Op.like]: `%${dnis}%` } },
							{ 'cel': { [Op.like]: `%${dnis}%` }  }
						]
					},
					nombre && {
						nombre_cte: { [Op.like]: `%${nombre}%` }
					}
				]
			},
			include: [
				{
					model: PromesasPagoApoyoEconomico,
					where: { estatus: 'proceso' },
					attributes: [
						'id_promesa',
						[Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa']
					],
					required: false
				},
				{
					model: Firma,
					attributes: ['nombre'],
					include: [
						{
							model: Productos,
							attributes: ['nombre_producto']
						}
					],
					as: 'firma_apoyo_economico'
				}
			],
			attributes : [
				...Object.keys(clientesApoyoEconomico.rawAttributes) ,
				[Sequelize.literal('"firma_apoyo_economico"."nombre"'), "nombre_firma"]
			]
		}),

		// Buscar el cliente en camel por el id ó los telefonos
		ClientesCamel.findAll({
			where: {
				[Sequelize.Op.and]: [
					cliente && { id_socio: { [Op.like]: `%${cliente}%` } },
					dnis && {
						[Sequelize.Op.or]: [
							{ 'telefono': { [Op.like]: `%${dnis}%` } },
							{ 'telefono2': { [Op.like]: `%${dnis}%` } }
						]
					},
					nombre && {
						nombre_socio: { [Op.like]: `%${nombre}%` }
					}
				]
			},
			include: [
				{
					model: PromesasPagoCame,
					where: { estatus: 'proceso' },
					attributes: [
						'id_promesa',
						[Sequelize.fn('format', Sequelize.col('fecha_promesa'), 'yyyy-MM-dd'), 'fecha_promesa']
					],
					required: false
				},
				{
					model: Firma,
					attributes: ['nombre'],
					include: [
						{
							model: Productos,
							attributes: ['nombre_producto']
						}
					],
					as: 'firma_came'
				}
			],
			attributes : [
				...Object.keys(ClientesCamel.rawAttributes) ,
				[Sequelize.literal('"firma_came"."nombre"'), "nombre_firma"]
			]
		})
	]


	try {

		const [cBancoAzteca, cApoyoEconomico, cCamel] = await Promise.all(querys);

		if (cBancoAzteca.length > 0) {
			cBancoAzteca.forEach(cliente => response.push({ firma: 'Banco_Azteca', cliente: cliente }));
		}
		if (cApoyoEconomico.length > 0) {
			cApoyoEconomico.forEach(cliente => response.push({ firma: 'Apoyo_Economico', cliente: cliente }));
		}
		if (cCamel.length > 0) {
			cCamel.forEach(cliente => response.push({ firma: 'Camel', cliente: cliente }));
		}


		// if (cBancoAzteca) {
		//     response.push({ firma: 'Apoyo_Economico', cliente: cBancoAzteca });
		// }


		// if (cApoyoEconomico) {
		//     response.push({ firma: 'Apoyo_Economico', cliente: cApoyoEconomico });
		// }

		// if (cCamel) {
		//     response.push({ firma: 'Camel', cliente: cCamel });
		// }


		return response;

	} catch (error) {

		console.error(error);
		throw 'Algo salio mal al momento de buscar el cliente';
	}
};


module.exports = buscarClienteIn;