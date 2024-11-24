const express = require('express');
const app = express();
const cors = require("cors");
const cron = require('node-cron');

const routes = require('./routes');
const fileUpload = require("express-fileupload");

require('dotenv').config();
process.env.TZ = 'America/Monterrey';

/** setting database */
const db = require("./models/index");
const { initTables } = require('./config/initTables');
const validarPromesasPagoCron = require('./helpers/validarPromesasPago.cron');
require('./models/roles.model');
require('./models/usuarios.model');
require('./models/tipificaciones.model');
require('./models/clientes-banco-azteca.model');
require('./models/pagos.model');
require('./models/pago-sin-promesa.model');
require('./models/promesas-pago.model');
require('./models/interaciones.model');
require('./models/permisos.model');
require('./models/permisos-roles.model');
require('./models/firma.model');
require('./models/convenios-banco-azteca.model');
require('./models/convenioPago.model');
require('./models/clientes-camel.model');
require('./models/clientes-apoyo-economico.model');
require('./models/promesas-pago-came.model');
require('./models/pagos-came.model');
require('./models/pagos-sin-promesa-came.model');
require('./models/promesas-pago-apoyo-economico.model');
require('./models/pagos-apoyo-economico.model');
require('./models/pagos-sin-promesa-apoyo-economico.model');
require('./models/interacciones-came.model');
require('./models/interacciones-apoyo-economico.model');
require('./models/log-promesas-apoyo_economico.model');
require('./models/log-promesas-came.model');
require('./models/log-promesas-banco-azteca.model');
require('./models/detalles-permisos.model');
require('./models/carteo-pantilla.model');

require('./models/asosiations');


cron.schedule('0 10 0 * * *', async() => {
    console.log('validando promesas' , new Date().toLocaleString());
    await validarPromesasPagoCron();
    
}, {
    scheduled: true,
    timezone: "America/Monterrey"
});


process.env.TZ = 'America/Monterrey';

db.authenticate('online');

//para hacer drop a las tablas canbiar a true
db.sync({ force: false }).then(() => {
    console.log("Drop and re-sync db.");
});


app.set('port', process.env.PORT || 9016);

/** setting cors */

// var corsOptions = {
//     origin: "http://localhost:8081"
// };

app.use(cors());
app.use(express.static('public'));

// parse requests of content-type - application/json
app.use(fileUpload({
    limits: { fileSize: 300 * 1024 * 1024 },
}));



app.use(express.json({ limit: '300mb' }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// console.log(routes);
/** Routes */
app.use('/', routes());

// setTimeout(() => {
//     (
//         async () => {
//             console.log('se hace');
//             await initTables();
//         }
//     )()
// }, 3000);




/** server running **/
app.listen(app.get('port'), () => {
    console.log('server runnig on port', app.get('port'));
});


