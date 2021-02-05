const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const ActividadCargo = require('../models/actividadCargo');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
const conocimientoAdicional = require('../models/conocimientoAdicional');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/actividadCargo/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    ActividadCargo.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('puesto')
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, actividadCargo) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                actividadCargo
            });
        });
});


/* 
    Metodo para agregar ambitos
*/
app.post('/actividadCargo', verificaToken, function(req, res) {
    let body = req.body;

    let actividadCargo = new ActividadCargo({
        descripcion: body.descripcion,
        fr: body.fr,
        co: body.co,
        cm: body.cm,
        total: body.total,
        empresa: body.empresa,
        puesto: body.puesto
    });

    actividadCargo.save((err, actividadCargoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividadCargo: actividadCargoDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/actividadCargo/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion', 'fr', 'co', 'cm', 'total', 'puesto']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    ActividadCargo.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, actividadCargoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            actividadCargo: actividadCargoDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/actividadCargo/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    ActividadCargo.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, actividadCargoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!actividadCargoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'actividadCargo no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            actividadCargo: actividadCargoBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/actividadCargo/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    ActividadCargo.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, actividadCargoActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!actividadCargoActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Grupo Ocupacional  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            actividadCargo: actividadCargoActivado
        });
    });
});

/* 
    Método para buscar los actividadCargos de una empresa
*/
app.get('/actividadCargo/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    ActividadCargo.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .populate('puesto')
        .populate('conocimientoAdicional')
        .exec((err, actividadCargo) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                actividadCargo
            });
        });
});

app.get("/actividadCargo/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    ActividadCargo.count({ estado: true }).exec((err, total) => {
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