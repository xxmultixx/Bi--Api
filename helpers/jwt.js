const jwt = require('jsonwebtoken');

const generarJWT = ({ payload = {} } = {}) => {

    delete payload?.iat;
    delete payload?.exp;    

    return new Promise((resolve, reject) => {

        try {
            const token = jwt.sign(payload, process.env.SECRET_WORD, {
                expiresIn: '365d'
            });

            resolve(token);

        } catch (error) {
            console.error(error);
            reject('No se pudo generar el token');
        }
    })
}


module.exports = { generarJWT }