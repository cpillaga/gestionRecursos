const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Admin = require('../models/admin');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));

app.post('/admin/login', function(req, res) {
    let body = req.body;

    Admin.findOne({ correo: body.correo }, (err, adminDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Administrador',
                errors: err
            });
        }

        if (!adminDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.clave, adminDB.clave)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        //Crear un token!!

        adminDB.clave = 'null';

        var token = jwt.sign({ admin: adminDB }, SEED, { expiresIn: 28800 }); //8 horas

        res.json({
            ok: true,
            admin: adminDB,
            token: token
        });

    });
});

app.post('/admin', function(req, res) {
    let body = req.body;

    let admin = new Admin({
        correo: body.correo,
        clave: bcrypt.hashSync(body.clave, 10)
    });

    admin.save((err, adminDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        adminDB.clave = null;

        res.json({
            ok: true,
            admin: adminDB
        });
    });
});


module.exports = app;