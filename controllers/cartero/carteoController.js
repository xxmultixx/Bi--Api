const html2pdf = require('html-pdf');
const { getClientesAztecaPDF, getClientesCamePDF, getClientesCameApoyoPDF } = require("../../helpers/carteo/getClientes");
const { getFiltrosClienteAzteca } = require("../../helpers/carteo/getFiltros");
const carteoPlantilla = require('../../models/carteo-pantilla.model');
const path = require('path');
const { subirArchivo } = require('../../helpers/upload_file');
const { Op } = require('Sequelize');


exports.getPlantillas = async (req, res) => {

    const plantillas = await carteoPlantilla.findAll({
        where: {
            id_firma: req.params?.id_firma || 1
        },
        attributes: ['id', 'nombre' , 'body' , 'img_encabezado' , 'img_pie' ]
    })

    return res.json({
        status: true,
        info: { msg: '' },
        data: plantillas
    });

}



exports.getImagenPlantilla = (req, res) => {

    const { img } = req.params;
    const path_img = path.join(__dirname, `../../uploads/carteo/${img}`);
    res.sendFile(path_img);

}

exports.modificarBodyPlantilla = async (req, res) => {

    const { html, id_plantilla } = req.body;

    try {

        await carteoPlantilla.update({ body: html }, { where: { id: id_plantilla } });
        res.json({
            status: true,
            info: { msg: 'Exito! Se actualizo el contenido correctamente...' },
            data: []
        });

    } catch (error) {

        console.log(error);

        return res.json({
            status: false,
            info: { msg: 'Error! No se logro actualizar el body de la platilla' },
            data: []
        });
    }



}

/* Banco azteca */
exports.getFiltrosForAzteca = async (req, res) => {

    const { codigo_postal } = req.query;

    try {
        const [coloniaDB, poblacionDB, estadoDB, gerenciaDB] = await getFiltrosClienteAzteca(codigo_postal);

        res.json({
            status: true, info: { msg: '' },
            data: {
                colonias: coloniaDB,
                poblaciones: poblacionDB,
                estados: estadoDB,
                gerencias: gerenciaDB
            }
        });
    } catch (error) {

        res.json({
            status: true,
            info: { msg: error },
            data: []
        });
    }



}


exports.generarPDFAzteca = async (req, res) => {

    const {
        codigo_postal,
        id_plantilla,
        colonia = '',
        poblacion = '',
        estado = '',
        gerencia = '',
        saldo_total_min = '',
        saldo_total_max = '',
        atraso_maximo_min = '',
        atraso_maximo_max = ''
    } = req.query;


    const plantillas = await getClientesAztecaPDF({ id_plantilla, codigo_postal, colonia, poblacion, estado, gerencia, saldo_total_min, saldo_total_max, atraso_maximo_min, atraso_maximo_max });


    try {

        const stream = await createHtlm2PdfStream(plantillas.toString());
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=carteo.pdf');
        stream.pipe(res);

    } catch (error) {

        return res.json({
            status: false,
            info: { msg: error },
            data: []
        });
    }

}

/* Banco Came */
exports.generarPDFCame = async (req, res) => {

    const { id_plantilla, termino } = req.query;


    try {

        const plantillas = await getClientesCamePDF({ id_plantilla, termino });

        console.log(plantillas);

        const stream = await createHtlm2PdfStream(plantillas.toString());
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=carteo.pdf');
        stream.pipe(res);

    } catch (error) {

        return res.json({
            status: false,
            info: { msg: error },
            data: []
        });
    }

}

/* Banco Apoyo */
exports.generarPDFApoyo = async (req, res) => {

    const { id_plantilla, operacionesId } = req.query;


    try {

        const plantillas = await getClientesCameApoyoPDF({ id_plantilla, operacionesId });

        const stream = await createHtlm2PdfStream(plantillas.toString());
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=carteo.pdf');
        stream.pipe(res);

    } catch (error) {

        return res.json({
            status: false,
            info: { msg: error },
            data: []
        });
    }

}


exports.cambiarImgsPlantilla = async (req, res) => {


    try {


        const { id_plantilla, imagenModificar } = req.body;

        if (!['encabezado', 'pie'].includes(imagenModificar)) {
            res.json({ status: false, info: { msg: 'Tienes que especificar que quieres modificar: encabezado o pie' }, data: [] });
            return;
        }

        const columna_editar = (imagenModificar === 'encabezado') ? 'img_encabezado' : 'img_pie';


        // Subir Archivo
        const fileName = await subirArchivo(req.files, 'carteo/', ['png', 'jpg', 'jpeg']);

        // Actulizar
        await carteoPlantilla.update({
            [columna_editar]: fileName
        }, {
            where: {
                id: id_plantilla,
            }
        });

        res.json({
            status: true,
            info: { msg: 'Se actualizo la imagen correctamente' },
            data: []
        })


    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            info: { msg: 'No se pudo actualizar imagen' },
            data: []
        });
    }


}


exports.getPlantilla = async (req, res) => {

    const { id_firma  = 1  , id_plantilla  } = req.params;


    const plantillas = await carteoPlantilla.findOne({
        where: {
            [Op.and] : [
                { id_firma: id_firma },
                { id : id_plantilla }
            ]
        },
        attributes: ['id', 'nombre' , 'body' , 'img_encabezado' , 'img_pie' ]
    })

    return res.json({
        status: true,
        info: { msg: '' },
        data: plantillas
    });

}




function createHtlm2PdfStream(html) {
    return new Promise((resolve, reject) => {
        html2pdf.create(html, { timeout: 900000 }).toStream((err, stream) => {
            if (err) {
                return reject(err);
            }
            resolve(stream);
        });
    });
}