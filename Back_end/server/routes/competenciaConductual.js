const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const CompetenciaConductual = require('../models/competenciaConductual');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/competenciaConductual/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    CompetenciaConductual.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, competenciaConductual) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                competenciaConductual
            });
        });
});


/* 
    Metodo para agregar ambitos
*/
app.post('/competenciaConductual', verificaToken, function(req, res) {
    let body = req.body;

    let competenciaConductual = new CompetenciaConductual({
        denominacion: body.denominacion,
        definicion: body.definicion,
        numero: body.numero,
        empresa: body.empresa
    });

    competenciaConductual.save((err, competenciaConductualDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            competenciaConductual: competenciaConductualDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/competenciaConductual/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['numero', 'denominacion', 'definicion']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    CompetenciaConductual.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, competenciaConductualDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            competenciaConductual: competenciaConductualDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/competenciaConductual/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    CompetenciaConductual.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, competenciaConductualBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!competenciaConductualBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'competenciaConductual no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            competenciaConductual: competenciaConductualBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/competenciaConductual/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    CompetenciaConductual.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, competenciaConductualActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!competenciaConductualActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Competencia Conductual  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            competenciaConductual: competenciaConductualActivado
        });
    });
});

/* 
    Método para buscar los competenciaConductuals de una empresa
*/
app.get('/competenciaConductual/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    CompetenciaConductual.find({ denominacion: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, competenciaConductual) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                competenciaConductual
            });
        });
});

app.get("/competenciaConductual/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    CompetenciaConductual.count({ estado: true }).exec((err, total) => {
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