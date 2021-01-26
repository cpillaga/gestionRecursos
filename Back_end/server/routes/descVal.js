const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Valorizacion = require('../models/valorizacion');
const Empresa = require('../models/empresa');
const Descval = require('../models/descVal');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/descval/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    Descval.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('valorizacion') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('grupoOcupacional') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, descval) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                descval
            });
        });
});


/* 
    Metodo para agregar descvals
*/
app.post('/descval', verificaToken, function(req, res) {
    let body = req.body;

    let descval = new Descval({
        descripcion: body.descripcion,
        observacion: body.observacion,
        calificacion: body.calificacion,
        subtitulo: body.subtitulo,
        valorizacion: body.valorizacion,
        grupoOcupacional: body.grupoOcupacional,
        empresa: body.empresa
    });

    descval.save((err, descvalDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            descval: descvalDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/descval/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion', 'observacion', 'calificacion', 'subtitulo', 'grupoOcupacional', 'valorizacion']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    Descval.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, descvalDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            descval: descvalDB
        });
    });
});

/* 
    Método para buscar los descvals de una empresa
*/
app.get('/descval/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Descval.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, descval) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                descval
            });
        });
});

module.exports = app;

//No olvidarse de poner la ruta en el index.js