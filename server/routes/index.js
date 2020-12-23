const express = require('express');
const app = express();

app.use(require('./admin'));
module.exports = app;