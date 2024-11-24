const Roles = require("../models/roles.model");

module.exports.mostrarRoles = async ( req, res ) => {

	try {
		
		const roles = await Roles.findAll({
			where : {
				status : 1
			}
		});

		return res.json({
            status: true,
            info: {
                msg: ''
            },
            data: roles
        })

	} catch (error) {

		console.error(error);

		return res.json({
            status: false,
            info: {
                msg: 'No se pudieron cargar roles'
            },
            data: []
        });

	}

}