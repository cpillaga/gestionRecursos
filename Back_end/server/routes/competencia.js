const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Competencia = require('../models/competencia');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los competencias de una empresa
*/
app.get('/competencia/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    Competencia.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, competencia) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                competencia
            });
        });
});


/* 
    Metodo para agregar competencias
*/
app.post('/competencia', verificaToken, function(req, res) {
    let body = req.body;

    let competencia = new Competencia({
        descripcion: body.descripcion,
        empresa: body.empresa
    });

    competencia.save((err, competenciaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            competencia: competenciaDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/competencia/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    Competencia.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, competenciaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            competencia: competenciaDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/competencia/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    Competencia.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, competenciaBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!competenciaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Competencia no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            competencia: competenciaBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/competencia/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Competencia.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, competenciaActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!competenciaActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Grupo Ocupacional  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            competencia: competenciaActivado
        });
    });
});

/* 
    Método para buscar los competencias de una empresa
*/
app.get('/competencia/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Competencia.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, competencia) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                competencia
            });
        });
});



app.get("/competencia/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    Competencia.count({ estado: true }).exec((err, total) => {
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