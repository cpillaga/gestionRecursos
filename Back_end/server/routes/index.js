const express = require('express');
const app = express();

app.use(require('./admin'));
app.use(require('./empresa'));
app.use(require('./usuario'));
app.use(require('./rol'));
app.use(require('./grupoOcupacional'));
app.use(require('./ambito'));
app.use(require('./experiencia'));
app.use(require('./puesto'));
app.use(require('./expPuesto'));
app.use(require('./valorizacion'));
app.use(require('./descVal'));
app.use(require('./actividadCargo'));
app.use(require('./actividadEsencial'));
app.use(require('./compCondObs'));
app.use(require('./competenciaConductual'));
app.use(require('./competenciaTecnica'));
app.use(require('./compTecObs'));
app.use(require('./conocimientoAdicional'));
app.use(require('./compTecPuesto'));
app.use(require('./compCondPuesto'));



module.exports = app;