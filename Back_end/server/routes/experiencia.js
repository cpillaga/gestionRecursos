const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Experiencia = require('../models/experiencia');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los experiencias de una empresa
*/
app.get('/experiencia/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    Experiencia.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, experiencia) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                experiencia
            });
        });
});


/* 
    Metodo para agregar experiencias
*/
app.post('/experiencia', verificaToken, function(req, res) {
    let body = req.body;

    let experiencia = new Experiencia({
        descripcion: body.descripcion,
        grado: body.grado,
        empresa: body.empresa
    });

    experiencia.save((err, experienciaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            experiencia: experienciaDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/experiencia/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion', 'grado']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    Experiencia.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, experienciaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            experiencia: experienciaDB
        });
    });
});


/* 
    Método para buscar los experiencias de una empresa
*/
app.get('/experiencia/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Experiencia.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, experiencia) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                experiencia
            });
        });
});

module.exports = app;

//No olvidarse de poner la ruta en el index.js