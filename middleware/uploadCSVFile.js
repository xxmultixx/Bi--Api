const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const { v4: uuidv4 } = require('uuid');

const csv = require ('fast-csv');

module.exports = async (req, res, next) => {
    
    try {

        let uploadFile = req.files.file;

        let file_path;

        if (!uploadFile) {
            return res.json({
                estatus: false,
                info: {
                    msg: 'No se envio archivo'
                },
                data: []
            })
        }

        console.log(uploadFile);
    
        if (uploadFile.mimetype !== 'text/csv' && uploadFile.mimetype !== 'application/vnd.ms-excel') {
            return res.json({
                estatus: false,
                info: {
                    msg: 'La extension del archivo no es valida'
                },
                data: []
            });
        }

        if (((uploadFile.size / 1024) / 1024) > 75) {
            return res.json({
                estatus: false,
                info: {
                    msg: 'El peso del archivo supera los 75Mb'
                },
                data: []
            });
        }

        const nuevo_nombre = uuidv4() + '.csv';

        await uploadFile.mv('./uploads/' + nuevo_nombre);

        file_path = appDir + '/uploads/' + nuevo_nombre;

        file_path = file_path.replaceAll('\\', '/');

        req.body.file_path = file_path;

        req.body.file_name = uploadFile.name;

        const arrayData = [ ];
        
        csv.parseFile(file_path, { headers: true , delimiter : req?.body?.delimiter || ',' })
            .on('error', error => {
                console.error('FAST PARSER', error);
                return res.json({
                    estatus: false,
                    info: {
                        msg: 'Hubo un error al validar el archivo'
                    },
                    data: []
                });

            })
            .on("data", data => {
                arrayData.push(data); 
            })
            .on("end", () => {

                req.body.encabezados_archivo = Object.keys(arrayData[0])
                
                next();
            });

    } catch (error) {

        console.error(error);

        res.json({
            estatus: false,
            info: {
                msg: 'Hubo un error al mover el archivo'
            },
            data: []
        })
    }

}