const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Proceso = require('../models/proceso');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los procesos de una empresa
*/
app.get('/proceso/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    Proceso.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, proceso) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                proceso
            });
        });
});


/* 
    Metodo para agregar procesos
*/
app.post('/proceso', verificaToken, function(req, res) {
    let body = req.body;

    let proceso = new Proceso({
        descripcion: body.descripcion,
        empresa: body.empresa,
    });

    proceso.save((err, procesoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            proceso: procesoDB
        });
    });
});

/*
    Método para modificar procesos
*/
app.put('/proceso/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    Proceso.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, procesoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //  empleadoDB.clave = null;
        res.json({
            ok: true,
            proceso: procesoDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/proceso/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    Proceso.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, procesoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!procesoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Proceso no encontrado'
                }
            });
        }

        // empleadoBorrado.password = null;
        res.json({
            ok: true,
            proceso: procesoBorrado
        });
    });
});

/* 
    Método para habilitar un proceso
*/
app.delete('/proceso/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Proceso.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, procesoActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!procesoActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Proceso no encontrado'
                }
            });
        }

        // empleadoActivado.password = null;
        res.json({
            ok: true,
            proceso: procesoActivado
        });
    });
});

/* 
    Método para buscar proceso de una empresa por nombre 
*/
app.get('/proceso/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Proceso.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, proceso) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                proceso
            });
        });
});

app.get("/proceso/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    Proceso.count({ estado: true }).exec((err, total) => {
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