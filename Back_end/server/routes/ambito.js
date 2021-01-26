const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Ambito = require('../models/ambito');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/ambito/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    Ambito.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, ambito) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                ambito
            });
        });
});


/* 
    Metodo para agregar ambitos
*/
app.post('/ambito', verificaToken, function(req, res) {
    let body = req.body;

    let ambito = new Ambito({
        descripcion: body.descripcion,
        empresa: body.empresa
    });

    ambito.save((err, ambitoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            ambito: ambitoDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/ambito/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    Ambito.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, ambitoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            ambito: ambitoDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/ambito/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    Ambito.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, ambitoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!ambitoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Ambito no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            ambito: ambitoBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/ambito/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Ambito.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, ambitoActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!ambitoActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Grupo Ocupacional  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            ambito: ambitoActivado
        });
    });
});

/* 
    Método para buscar los ambitos de una empresa
*/
app.get('/ambito/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Ambito.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, ambito) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                ambito
            });
        });
});

app.get("/ambito/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    Ambito.count({ estado: true }).exec((err, total) => {
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