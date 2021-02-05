const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Experiencia = require('../models/experiencia');
const Puesto = require('../models/puesto');
const ExpPuesto = require('../models/expPuesto');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los experiencias de una empresa
*/
app.get('/expPuesto/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    ExpPuesto.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('experiencia') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('puesto') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate

    .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, expPuesto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                expPuesto
            });
        });
});


/* 
    Metodo para agregar expPuestos
*/
app.post('/expPuesto', verificaToken, function(req, res) {
    let body = req.body;

    let expPuesto = new ExpPuesto({
        area: body.area,
        tiempo: body.tiempo,
        especificidad: body.especificidad,
        experiencia: body.experiencia,
        puesto: body.puesto,
        empresa: body.empresa
    });

    expPuesto.save((err, expPuestoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            expPuesto: expPuestoDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/expPuesto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['area', 'tiempo', 'especificidad, experiencia, puesto']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    ExpPuesto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, expPuestoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            expPuesto: expPuestoDB
        });
    });
});


/* 
    Método para dar de baja a un proceso
*/
app.delete('/expPuesto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    ExpPuesto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, expPuestoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!expPuestoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'expPuesto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            expPuesto: expPuestoBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/expPuesto/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    ExpPuesto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, expPuestoActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!expPuestoActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'expPuesto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            expPuesto: expPuestoActivado
        });
    });
});




/* 
    Método para buscar los expPuestos de una empresa
*/
app.get('/expPuesto/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    ExpPuesto.find({ area: regex, empresa: empresaB })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('experiencia') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('puesto')
        .exec((err, expPuesto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                expPuesto
            });
        });
});


app.get("/expPuesto/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    ExpPuesto.count({ estado: true }).exec((err, total) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            total,
        });
    });

});

module.exports = app;

//No olvidarse de poner la ruta en el index.js