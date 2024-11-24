const { dirname } = require('path');
const appDir = dirname(require.main.filename);

const { v4: uuidv4 } = require('uuid');

const csv = require ('fast-csv');

module.exports = async (req, res, next) => {
    
    try {
        if (req.files && req.files.file) {
        let uploadFile = req.files.file;

        //console.log("uploadFile:" + uploadFile);
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
    
        

        if (((uploadFile.size / 1024) / 1024) > 75) {
            return res.json({
                estatus: false,
                info: {
                    msg: 'El peso del archivo supera los 75Mb'
                },
                data: []
            });
        }

        const nuevo_nombre = uuidv4() + '.jpeg';

        await uploadFile.mv('./uploads/' + nuevo_nombre);

        file_path = appDir + '/uploads/' + nuevo_nombre;

        file_path = file_path.replaceAll('\\', '/');

        req.body.file_path = file_path;

        req.body.file_name = uploadFile.name;
        next();
    }
    else{
        next();
    }
    } catch (error) {

        console.error(error);
        next();
        res.json({
            estatus: false,
            info: {
                msg: 'Hubo un error al mover el archivo'
            },
            data: []
        })
    }

}