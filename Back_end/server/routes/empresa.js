const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));




app.get('/empresa/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    Empresa.find({ _id: id })
        .exec((err, empresa) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                empresa
            });
        });
});

/*
    Método para obntener todas las empresas Activas
*/

app.get('/empresa', verificaToken, function(req, res) {


    // Empresa.find({ estado: true }, 'ruc razonSocial telefono direccion correo img fechaIngreso estadoPago') // lista las empresas true
    Empresa.find({})
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, empresa) => {

            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Empresa.count({}, (err, conteo) => {
            //     res.json({
            //         ok: true,
            //         empresa,
            //         numero_registros: conteo
            //     });
            // });
            res.json({
                ok: true,
                empresa
            });

        });
});



/* 
    Metodo para agregar empresas
*/
app.post('/empresa', verificaToken, function(req, res) {
    let body = req.body;

    let empresa = new Empresa({
        ruc: body.ruc,
        razonSocial: body.razonSocial,
        telefono: body.telefono,
        direccion: body.direccion,
        correo: body.correo,
        img: body.img,
        fechaIngreso: body.fechaIngreso,
        estadoPago: body.estadoPago
    });

    empresa.save((err, empresaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // empleado.clave = 'null';

        res.json({
            ok: true,
            empresa: empresaDB
        });
    });
});

/*
    Método para modificar empresa
*/
app.put('/empresa/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['ruc', 'razonSocial', 'telefono', 'direccion', 'correo', 'img', 'fechaIngreso', 'estadoPago']); //Dentro de los corchetes va los campos a modificarse


    Empresa.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, empresaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        empresaDB.clave = null;
        res.json({
            ok: true,
            empresa: empresaDB
        });
    });
});

/* 
    Método para dar de baja a una empresa
*/
app.delete('/empresa/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    Empresa.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, empresaBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!empresaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            empresa: empresaBorrado
        });
    });
});

/* 
    Método para habiñitar a un empresa
*/
app.delete('/empresa/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Empresa.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, empresaActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!empresaActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            empresa: empresaActivado
        });
    });
});

/* 
    Método para buscar empresa por nombre 
*/
app.get('/empresa/buscar/:termino', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");

    Empresa.find({ razonSocial: regex })
        .exec((err, empresa) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                empresa
            });
        });
});


module.exports = app;

//No olvidarse de poner la ruta en el index.js