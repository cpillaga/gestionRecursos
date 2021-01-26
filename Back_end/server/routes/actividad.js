const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Actividad = require('../models/actividad');
const Empresa = require('../models/empresa');
const Proceso = require('../models/proceso');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todas las actividades de un proceso y de un aempresa
*/
app.get('/actividad/:idEmp', verificaToken, function(req, res) {
    let idemp = req.params.idEmp;

    Actividad.find({ empresa: idemp })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('proceso')
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, actividad) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                actividad
            });
        });
});


/* 
    Metodo para agregar actividades
*/
app.post('/actividad', verificaToken, function(req, res) {
    let body = req.body;

    let actividad = new Actividad({
        descripcion: body.descripcion,
        empresa: body.empresa,
        proceso: body.proceso
    });

    actividad.save((err, actividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividad: actividadDB
        });
    });
});

/*
    Método para modificar actividades
*/
app.put('/actividad/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    Actividad.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, actividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            actividad: actividadDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/actividad/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    Actividad.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, actividadBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!actividadBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Actividad no encontrado'
                }
            });
        }

        // empleadoBorrado.password = null;
        res.json({
            ok: true,
            actividad: actividadBorrado
        });
    });
});

/* 
    Método para habilitar un actividad
*/
app.delete('/actividad/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Actividad.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, actividadActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!actividadActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Actividad no encontrado'
                }
            });
        }

        // empleadoActivado.password = null;
        res.json({
            ok: true,
            actividad: actividadActivado
        });
    });
});

/* 
    Método para buscar actividad de un proceso y una empresa por nombre 
*/
app.get('/actividad/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Actividad.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .populate('proceso')
        .exec((err, actividad) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                actividad
            });
        });
});

app.get("/actividad/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    Actividad.count({ estado: true }).exec((err, total) => {
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