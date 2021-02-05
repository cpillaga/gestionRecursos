const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Conocimiento = require('../models/conocimientoAdicional');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/conocimiento/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    Conocimiento.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, conocimiento) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                conocimiento
            });
        });
});


/* 
    Metodo para agregar ambitos
*/
app.post('/conocimiento', verificaToken, function(req, res) {
    let body = req.body;

    let conocimiento = new Conocimiento({
        descripcion: body.descripcion,
        empresa: body.empresa
    });

    conocimiento.save((err, conocimientoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            conocimiento: conocimientoDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/conocimiento/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    Conocimiento.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, conocimientoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            conocimiento: conocimientoDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/conocimiento/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    Conocimiento.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, conocimientoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!conocimientoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Conocimiento no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            conocimiento: conocimientoBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/conocimiento/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Conocimiento.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, conocimientoActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!conocimientoActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Grupo Ocupacional  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            conocimiento: conocimientoActivado
        });
    });
});

/* 
    Método para buscar los conocimientos de una empresa
*/
app.get('/conocimiento/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Conocimiento.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, conocimiento) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                conocimiento
            });
        });
});

app.get("/conocimiento/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    Conocimiento.count({ estado: true }).exec((err, total) => {
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