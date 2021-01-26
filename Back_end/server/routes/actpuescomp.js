const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const ActividadPuesto = require('../models/actividadPuesto');
const Empresa = require('../models/empresa');
const Competencia = require('../models/competencia');
const Actpuescomp = require('../models/actpuescomp');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todas las actividades de un proceso y de un aempresa
*/
app.get('/actpuescomp/:idEmp', verificaToken, function(req, res) {
    let idemp = req.params.idEmp;

    Actpuescomp.find({ empresa: idemp })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('actividadPuesto')
        .populate('competencia')
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, actpuescomp) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                actpuescomp
            });
        });
});


/* 
    Metodo para agregar actpuescompes
*/
app.post('/actpuescomp', verificaToken, function(req, res) {
    let body = req.body;

    let actpuescomp = new Actpuescomp({
        actividad: body.actividad,
        empresa: body.empresa,
        puesto: body.puesto
    });

    actpuescomp.save((err, actpuescompDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actpuescomp: actpuescompDB
        });
    });
});

module.exports = app;

//No olvidarse de poner la ruta en el index.js