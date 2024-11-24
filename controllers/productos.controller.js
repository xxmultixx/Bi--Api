const Firma = require("../models/firma.model");
const Productos = require("../models/productos.model");

module.exports.obtenerProductosFirma = async (req, res) => {

    
    let { id_firma } = req.params;

       // Verifica si id_firma es la cadena 'null' y la convierte a null
       if (id_firma === 'null') {
        id_firma = null;
    }

    try {
        const productos = await Productos.findAll({
            where: {
                id_firma: id_firma
            },
            include: [
                { 
                    model :  Firma ,
                    attributes : [ ['nombre' ,'nombre_firma'] ]
                }
            ],
            order: [['id_producto', 'asc']],
        });

        return res.json({
            status: true,
            info: {
                msg: 'Productos'
            },
            data: productos

        });

    } catch (error) {
        console.error(error);

        return res.json({
            status: false,
            info: {
                msg: 'No se pudieron cargar los productos'
            },
            data: []

        });
    }
}

module.exports.crearProducto = async (req, res) => {

    const { id_firma, nombre_producto } = req.body;

    try {
        const producto = new Productos({
            id_firma: id_firma,
            nombre_producto: nombre_producto
        });


        if (!producto) {
            return res.json({
                status: false,
                info: {
                    msg: 'No se pudieron cargar los productos'
                },
                data: []
            });
        }

        await producto.save();

        return res.json({
            status: true,
            info: {
                msg: 'Producto agregado'
            },
            data: producto
        });

    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            info: {
                msg: 'No se pudieron cargar los productos'
            },
            data: []
        });
    }
}

module.exports.actualizarProducto = async ( req , res ) => {

    const { id_producto , nombre_producto , activo  } = req.body;

    try {
        const producto = await Productos.findOne({
            where : {
                id_producto : id_producto
            }
        });
    
        if (!producto) {
            return res.json({
                status: false,
                info: {
                    msg: 'No se encontro producto'
                },
                data: []
            });
        }

        producto.nombre_producto = nombre_producto ;
        producto.activo = activo ;

        await producto.save();

        return res.json({
            status: true,
            info: {
                msg: 'El producto se actualizó de manera correcta.'
            },
            data: producto
        });

    } catch (error) {
        
        console.error(error);

        return res.json({
            status: false,
            info: {
                msg: 'No se pudo actualizar producto'
            },
            data: []
        });
    }
}