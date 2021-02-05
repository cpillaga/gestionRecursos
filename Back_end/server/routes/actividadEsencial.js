const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const ActividadEsencial = require('../models/actividadEsencial');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
const conocimientoAdicional = require('../models/conocimientoAdicional');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/actividadEsencial/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    ActividadEsencial.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('puesto')
        .populate('conocimientoAdicional')
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, actividadEsencial) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                actividadEsencial
            });
        });
});


/* 
    Metodo para agregar ambitos
*/
app.post('/actividadEsencial', verificaToken, function(req, res) {
    let body = req.body;

    let actividadEsencial = new ActividadEsencial({
        descripcion: body.descripcion,
        empresa: body.empresa,
        conocimientoAdicional: body.conocimientoAdicional,
        puesto: body.puesto
    });

    actividadEsencial.save((err, actividadEsencialDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividadEsencial: actividadEsencialDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/actividadEsencial/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion', 'conocimientoAdicional', 'puesto']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    ActividadEsencial.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, actividadEsencialDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            actividadEsencial: actividadEsencialDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/actividadEsencial/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    ActividadEsencial.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, actividadEsencialBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!actividadEsencialBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'actividadEsencial no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            actividadEsencial: actividadEsencialBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/actividadEsencial/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    ActividadEsencial.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, actividadEsencialActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!actividadEsencialActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Grupo Ocupacional  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            actividadEsencial: actividadEsencialActivado
        });
    });
});

/* 
    Método para buscar los actividadEsencials de una empresa
*/
app.get('/actividadEsencial/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    ActividadEsencial.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .populate('puesto')
        .populate('conocimientoAdicional')
        .exec((err, actividadEsencial) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                actividadEsencial
            });
        });
});

app.get("/actividadEsencial/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    ActividadEsencial.count({ estado: true }).exec((err, total) => {
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