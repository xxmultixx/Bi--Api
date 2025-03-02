const db = require("../../models/index");
const { QueryTypes } = require('sequelize');

const { v4: uuidv4 } = require('uuid'); // Asegúrate de importar uuid

const path = require('path');




exports.obtenerGenerales = async (req, res) => {
    const { date } = req.body;  

    const sql = 'EXEC  fecha_ingresada @fecha = ? ';  

    try {
		const respuesta = await db.query(sql, {
			replacements: [date],
			type: QueryTypes.RAW

		});
        
        res.json({
            isSuccess: true,
            data: respuesta  [0]
        });
    } catch (error) {
        res.status(500).json({ message: "Error: las fechas no coinciden", error: error.message });
    }
};

exports.InsertarInformacion = async (req, res) => {
    const { usuario, nombrelista} = req.body;  
	const estatus = 1;

    const sql = 'EXEC GeneradorListas @usuario = ? , @NOMBRELISTA = ? , @ESTATUS = ?';  

    try {
		const respuesta = await db.query(sql, {
			replacements: [usuario, nombrelista, estatus],
			type: QueryTypes.RAW

		});
        
        res.json({
            isSuccess: true,
            data: respuesta  [0]
        });
    } catch (error) {
        res.status(500).json({ message: "Error credenciales invalidas", error: error.message });
    }
};
exports.ArchivoExtraer = async (req, res) => {

    if (!req.files || !req.files.file) {
        return res.json({
            status: false,
            info: {
                msg: "No se envió archivo"
            },
            data: []
        });
    }

    const uploadFile = req.files.file;

  
    if (uploadFile.mimetype !== 'text/csv' && uploadFile.mimetype !== 'application/vnd.ms-excel') {
        return res.json({
            status: false,
            info: {
                msg: 'La extensión del archivo no es válida. Se requiere un archivo CSV.'
            },
            data: []
        });
    }

 
    if (((uploadFile.size / 1024) / 1024) > 75) {
        return res.json({
            status: false,
            info: {
                msg: 'El peso del archivo supera los 75 MB'
            },
            data: []
        });
    }

   
    const nuevo_nombre = uuidv4() + '.csv';

    
    const uploadPath = path.join('C:\\SQLUploads', nuevo_nombre);
    
    try {
      
        await uploadFile.mv(uploadPath);

      
        const sql = `EXEC ArchivoInfo @url_archivo = ?`;
        const response = await db.query(sql, {
            replacements: [uploadPath],
            type: db.QueryTypes.RAW 
        });

        
        if (response[0][0]?.error_carga == '1') {
            return res.json({
                status: false,
                info: {
                    msg: response[0][0].mensaje
                },
                data: []
            });
        }

     
        return res.json({
            status: true,
            info: {
                msg: "La carga se subió de manera exitosa!!!!",
            },
            data: response[0][0]
        });

    } catch (error) {
       
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: "Hubo un error al subir la carga :("
            },
            data: []
        });
    }
};







module.exports.testDiegoController = async (req, res) => {

	const { filtro } = req.params;

	try {
		const sql = `EXEC SP_GETSALDOSBLASTER
		@FILTRO = ?`;

		const respuesta = await db.query(sql, {
			replacements: [filtro],
			type: QueryTypes.RAW

		});

const data = {
mensaje: "Este es un mensaje de prueba"

}

		return res.json({
            status: true,
            info: {
                msg: 'Consulta exitosa'
            },
            data: data
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
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
//apartir de aqui es lo que vas a necesitar para el front
//Parte aldo

// Insertar lista

exports.InsertarLista = async (req, res) => {
    const { creador, nombrelista} = req.body;  
	

    const sql = 'EXEC DIEGO_INSERTALISTA @CREADOR = ? , @NOMBRELISTA = ?';  

    try {
		const respuesta = await db.query(sql, {
			replacements: [creador, nombrelista],
			type: QueryTypes.RAW

		});
        
        res.json({
            isSuccess: true,
            data: respuesta  [0]
        });
    } catch (error) {
        res.status(500).json({ message: "Error credenciales invalidas", error: error.message });
    }
};

//muestra listas

exports.muestraLista = async (req, res) => {
    try {
        const sql = 'EXEC SP_OBTIENELISTAS';  
        const respuesta = await db.query(sql, {
            type: QueryTypes.RAW 
        });
        
        res.json({
            isSuccess: true,
            data: respuesta
        });
    } catch (error) {
        res.status(500).json({
            isSuccess: false,
            error: error.message
        });
    }
};

//sp que inserta a ListaSMS

exports.InsertaraListaSMS = async (req, res) => {
    const { id, usuario } = req.body;  

    if (!req.files || !req.files.file) {
        return res.json({
            status: false,
            info: {
                msg: "No se envió archivo"
            },
            data: []
        });
    }

    
    const uploadFile = req.files.file;  

    if (uploadFile.mimetype !== 'text/csv' && uploadFile.mimetype !== 'application/vnd.ms-excel') {
        return res.json({
            status: false,
            info: {
                msg: 'La extensión del archivo no es válida. Se requiere un archivo CSV.'
            },
            data: []
        });
    }

    if (((uploadFile.size / 1024) / 1024) > 75) {
        return res.json({
            status: false,
            info: {
                msg: 'El peso del archivo supera los 75 MB'
            },
            data: []
        });
    }

    
    const nuevo_nombre = uuidv4() + '.csv';
    const uploadPath = path.join('C:\\SQLUploads', nuevo_nombre);

    try {
        await uploadFile.mv(uploadPath);

        const sql = 'EXEC sp_insertaListaSMS @idlista = ? , @usuario = ?, @urlArchivo = ?';  
        
        const respuesta = await db.query(sql, {
            replacements: [id, usuario, uploadPath],
            type: QueryTypes.RAW
        });
        
        
        if (respuesta[0][0]?.error_carga == '1') {
            return res.json({
                status: false,
                info: {
                    msg: respuesta[0][0].mensaje
                },
                data: []
            });
        }
     
        
        return res.json({
            status: true,
            info: {
                msg: "La carga se subió de manera exitosa!!!!",
            },
            data: respuesta[0][0]
        });
    } catch (error) {
        
        res.status(500).json({ 
            message: "Algo ha salido mal", 
            error: error.message 
        });
    }
};

//eliminar registros

exports.Eliminar = async (req, res) => {
    const { id} = req.body;  
	

    const sql = 'EXEC SP_eliminaRegistrosListasSMS @idCarga = ?';  

    try {
		const respuesta = await db.query(sql, {
			replacements: [id],
			type: QueryTypes.RAW

		});
        
        res.json({
            isSuccess: true,
            data: respuesta  [0]
        });
    } catch (error) {
        res.status(500).json({ message: "Error credenciales invalidas", error: error.message });
    }
};