const db = require("../../models/index");
const { QueryTypes } = require('sequelize');
const { Parser } = require("json2csv");
const { v4: uuidv4 } = require('uuid'); // Asegúrate de importar uuid
const fs = require("fs");
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const { response } = require("express");



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

//eliminar registros listas

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

// Mostrar carga

exports.Cargas = async (req, res) => {
    

    const sql = 'EXEC MostrarCargas';  

    try {
		const respuesta = await db.query(sql, {
			replacements: [],
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


//Eliminar cargas

exports.EliminarCargas = async (req, res) => {
    const {id} = req.body;

    const sql = 'EXEC EliminarCargas @idsms = ?';  

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

//Descarga el arhcivo para savage
exports.Descargararchivo = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "ID requerido" });
    }

    const sql = 'EXEC DescargarArchivo @id_a = ?';  

    try {
        const respuesta = await db.query(sql, {
            replacements: [id],
            type: QueryTypes.SELECT
        });

        if (!respuesta || respuesta.length === 0) {
            return res.status(404).json({ message: "No se encontraron datos" });
        }

      
        const parser = new Parser();
        const csv = parser.parse(respuesta);

       
        const folderPath = path.join(__dirname, '../../public/archivos');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

       
        const filePath = path.join(folderPath, `Reporte_${id}.csv`);
        fs.writeFileSync(filePath, csv);

       
        res.setHeader('Content-Disposition', `attachment; filename=Reporte_${id}.csv`);
        res.setHeader('Content-Type', 'text/csv');

        res.download(filePath, `Reporte_${id}.csv`, (err) => {
            if (err) {
                console.error("Error al enviar el archivo:", err);
                return res.status(500).json({ message: "Error al descargar el archivo" });
            }
        });

    } catch (error) {
        console.error("Error al generar el archivo:", error);
        res.status(500).json({ message: "Error al procesar la solicitud", error: error.message });
    }
};

exports.Dividirporarchivos = async (req, res) => {
    const { id, mensaje, idm } = req.body;

    if (!id || !mensaje) {
        return res.status(400).json({ isSuccess: false, message: "Faltan parámetros requeridos: 'id' o 'mensaje'." });
    }

    const sql = 'EXEC sp_Dividirporlotes @id_a = ?, @mensaje = ?, @id_m = ?';
    let rutaArchivo = null;

    try {
        const respuestaDB = await db.query(sql, {
            replacements: [id, mensaje, idm],
            type: QueryTypes.SELECT
        });

       
        console.log("Registros devueltos por la consulta:", respuestaDB);

        if (!respuestaDB || respuestaDB.length === 0) {
            return res.status(404).json({ isSuccess: false, message: "No se encontraron datos en la base de datos para el ID proporcionado." });
        }

        
        const cleanedRespuestaDB = respuestaDB.map(record => {
            const cleanedTelefono = record.telefono 
                ? record.telefono.replace(/[\r\n]+/g, '').trim()
                : '';
            const cleanedMensaje = record.mensaje_enviar 
                ? record.mensaje_enviar.trim()
                : '';
            return { 
                TELEFONO: cleanedTelefono,
                MENSAJEENVIAR: cleanedMensaje
            };
        });
        
        console.log("Registros después de la limpieza:", cleanedRespuestaDB.length);

        const carpetaArchivos = path.join(__dirname, '..', 'temp_files', 'sms_csv');
        if (!fs.existsSync(carpetaArchivos)) {
            fs.mkdirSync(carpetaArchivos, { recursive: true });
        }

        const nombreArchivo = `lote_sms_${id}_${Date.now()}.csv`;
        rutaArchivo = path.join(carpetaArchivos, nombreArchivo);

        
        const fields = ['TELEFONO', 'MENSAJEENVIAR'];
        const opts = { fields, quote: '', eol: '\n' };
        const parser = new Parser(opts);
        const csvData = parser.parse(cleanedRespuestaDB);

        fs.writeFileSync(rutaArchivo, csvData, "utf-8");
        console.log(`Archivo CSV temporal generado para Calixta en: ${rutaArchivo}`);

        const formData = new FormData();
        formData.append("cte", process.env.CALIXTA_CTE || "49827");
        formData.append("encpwd", process.env.CALIXTA_ENCPWD || "925f248b07a5b0d54edc045430eda7b089d8e6ba47cd4d69533e146d98a6685a626164f65b26af53989ccb77e7a0e994");
        formData.append("email", process.env.CALIXTA_EMAIL || "biconsultores@jesconsulting.com.mx");
        formData.append("mtipo", "SMS");
        formData.append("tipoDestino", "2");
        formData.append("json", "1");
        formData.append("mensaje", "{$MENSAJEENVIAR$}");
        formData.append("archivo", fs.createReadStream(rutaArchivo), nombreArchivo);

        const headers = { ...formData.getHeaders() };

        const apiUrl = process.env.CALIXTA_API_URL || "https://api1.calixtaondemand.com/Controller.php/__a/sms.extsend.remote.sa";
        console.log(`Enviando solicitud POST a Calixta: ${apiUrl}`);

        const apiResponse = await axios.post(apiUrl, formData, {
            headers,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        console.log('Respuesta de la API Calixta:', apiResponse.data);

        res.json({
            isSuccess: true,
            data: cleanedRespuestaDB[0],
            message: "Solicitud de envío de SMS a Calixta procesada.",
            apiResponse: apiResponse.data
        });

    } catch (error) {
        console.error("Error detallado en Dividirporarchivos:", error);
        let errorMessage = "Error al procesar la solicitud de envío de SMS a Calixta.";
        let statusCode = 500;

        if (axios.isAxiosError(error)) {
            errorMessage = "Error al comunicarse con la API de Calixta.";
            if (error.response) {
                statusCode = error.response.status;
                errorMessage += ` Código HTTP: ${statusCode}. Respuesta API: ${JSON.stringify(error.response.data)}`;
                console.error('Error Data API Calixta:', error.response.data);
            } else if (error.request) {
                errorMessage += " No se recibió respuesta del servidor de la API de Calixta.";
                console.error('Error Request API Calixta:', error.request);
            }
        } else if (error instanceof Error) {
            errorMessage = `Error interno en el servidor: ${error.message}`;
        }

        res.status(statusCode).json({
            isSuccess: false,
            message: errorMessage,
            errorDetails: error.message
        });

    } finally {
        if (rutaArchivo && fs.existsSync(rutaArchivo)) {
            try {
                
                fs.unlinkSync(rutaArchivo);
                console.log(`Archivo temporal eliminado: ${rutaArchivo}`);
            } catch (cleanupError) {
                console.error(`¡Error al eliminar el archivo temporal ${rutaArchivo}!`, cleanupError);
            }
        }
    }
};




//Mostrar sms ya enviados y capturados en la base xd
exports.MostrarSMS = async (req, res) => {
    

    const sql = 'EXEC MostrarMensajes';  

    try {
		const respuesta = await db.query(sql, {
			replacements: [],
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

exports.Resumenmostrar = async (req, res) => {

    const sql = 'EXEC sp_mostrarresumen';  

    try {
		const respuesta = await db.query(sql, {
			replacements: [],
			type: QueryTypes.RAW
		});
        
        res.json({
            isSuccess: true,
            data: respuesta  [0]
        });
    } 
    catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Error credenciales invalidas", error: error.message });
    }
};


exports.Apiprueba = async (req, res) => {
    const{idie} = req.body

    const sql = 'EXEC Prueba @id = ?';  

    try {
		const respuesta = await db.query(sql, {
			replacements: [idie],
			type: QueryTypes.RAW
		});
        
        res.json({
            isSuccess: true,
            data: respuesta  [0]
        });
    } 
    catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Error credenciales invalidas", error: error.message });
    }
};