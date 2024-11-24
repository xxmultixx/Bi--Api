const path = require('path');
const { subirArchivo } = require("../helpers/upload_file");
const ConvenioPago = require("../models/convenioPago.model");


exports.nuevoPagoConvenio = async (req, res) => {

    const { id, id_convenio, monto_real } = req.body;
    const extensionesValidas = ['png', 'jpg', 'jpej', 'gif'];


    try {

        const pago = await ConvenioPago.findOne({ where: { id, id_convenio, estatus: 'proceso' } });
        if (!pago) {
            return res.json({ status: false, info: { msg: 'No exite la fecha de pago solicitada o ya fue realizado.' }, data: [] });
        }

        const comprobante = await subirArchivo(req.files, extensionesValidas, 'convenioPagos');
        if (!comprobante) {
            return res.json({ status: false, info: { msg: 'No se logro subir el comprobante hable con el administrador.' }, data: [] });

        }

        const dataActualizar = {
            monto_real,
            comprobante,
            estatus: 'completo',
        }

        await ConvenioPago.update(dataActualizar, { where: { id, id_convenio } });


        res.json({
            status: 'true',
            info: {
                msg: 'Se guardo con exito el pago correspondiente al convenio',
            }
        });


    } catch (error) {

        console.log('Mi error', error);
        res.status(500).json(error);
    }

}


exports.renderImg = async (req, res) => {

    const { img } = req.params;

    const pathImg = path.join(__dirname, `../uploads/convenioPagos/${img}`);
    res.sendFile(pathImg);



}