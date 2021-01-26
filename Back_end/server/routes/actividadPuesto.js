const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const ActividadPuesto = require('../models/actividadPuesto');
const Empresa = require('../models/empresa');
const Actividad = require('../models/actividad');
const Puesto = require('../models/puesto');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/actividadPuesto/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    ActividadPuesto.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('puesto') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('actividad') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, actividadPuesto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                actividadPuesto
            });
        });
});


/* 
    Metodo para agregar actividadPuestos
*/
app.post('/actividadPuesto', verificaToken, function(req, res) {
    let body = req.body;

    let actividadPuesto = new ActividadPuesto({
        descripcion: body.descripcion,
        empresa: body.empresa,
        tipo: body.tipo,
        actividad: body.actividad,
        puesto: body.puesto
    });

    actividadPuesto.save((err, actividadPuestoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividadPuesto: actividadPuestoDB
        });
    });
});

/*
    Método para modificar 
*/
app.put('/actividadPuesto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion', 'tipo']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    ActividadPuesto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, actividadPuestoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividadPuesto: actividadPuestoDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/actividadPuesto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    ActividadPuesto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, actividadPuestoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!actividadPuestoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'activad Esencial no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            actividadPuesto: actividadPuestoBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/actividadPuesto/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    ActividadPuesto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, actividadPuestoActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!actividadPuestoActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Grupo Ocupacional  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            actividadPuesto: actividadPuestoActivado
        });
    });
});

/* 
    Método para buscar los ambitos de una empresa
*/
app.get('/actividadPuesto/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    ActividadPuesto.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .populate('puesto') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('actividad') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .exec((err, actividadPuesto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                actividadPuesto
            });
        });
});



app.get("/actividadPuesto/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    ActividadPuesto.count({ estado: true }).exec((err, total) => {
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