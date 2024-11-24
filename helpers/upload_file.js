const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ({ archivo }, carpeta = '', extencionesValidas = [],) => {

    return new Promise((resolve, reject) => {

        // Obtener la extencion del archivo
        const nombreCortado = archivo.name.split('.');
        const extencion = nombreCortado[nombreCortado.length - 1];



        // Validar la extencion del archivo.
        if(extencionesValidas.length > 0){
            if (!extencionesValidas.includes(extencion)) {
                reject(`Solo se permiten archivos con extenciones ${extencionesValidas}`);
                return;
            };
        }


        // Definir nombre unico y la carpta dond ese va a guardar.
        const nombreTemp = uuidv4() + '.' + extencion;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);


        // Subir imagen al servidor
        archivo.mv(uploadPath, function (err) {

            if (err) {
                reject(err);
            }
            resolve(nombreTemp);
        });

    });

}


module.exports = {
    subirArchivo
}

