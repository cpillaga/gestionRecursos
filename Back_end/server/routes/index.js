const express = require('express');
const app = express();

app.use(require('./admin'));
app.use(require('./proceso'));
app.use(require('./empresa'));
app.use(require('./usuario'));
app.use(require('./actividad'));
app.use(require('./rol'));
app.use(require('./grupoOcupacional'));
app.use(require('./ambito'));
app.use(require('./competencia'));
app.use(require('./experiencia'));
app.use(require('./puesto'));
app.use(require('./actividadPuesto'));
app.use(require('./expPuesto'));
app.use(require('./actpuescomp'));
app.use(require('./valorizacion'));
app.use(require('./descVal'));

module.exports = app;