const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const CompCondPuesto = require('../models/compCondPuesto');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/compCondPuesto/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    CompCondPuesto.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('competecniaConductual')
        .populate('puesto')
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, compCondPuesto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                compCondPuesto
            });
        });
});


/* 
    Metodo para agregar ambitos
*/
app.post('/compCondPuesto', verificaToken, function(req, res) {
    let body = req.body;

    let compCondPuesto = new CompCondPuesto({
        puesto: body.puesto,
        competenciaConductual: body.competenciaConductual,
        empresa: body.empresa
    });

    compCondPuesto.save((err, compCondPuestoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            compCondPuesto: compCondPuestoDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/compCondPuesto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['puesto', 'competenciaConductual']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    CompCondPuesto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, compCondPuestoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            compCondPuesto: compCondPuestoDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/compCondPuesto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    CompCondPuesto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, compCondPuestoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!compCondPuestoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'compCondPuesto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            compCondPuesto: compCondPuestoBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/compCondPuesto/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    CompCondPuesto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, compCondPuestoActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!compCondPuestoActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Competencia Condnica  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            compCondPuesto: compCondPuestoActivado
        });
    });
});

/* 
    Método para buscar los compCondPuestos de una empresa
*/
app.get('/compCondPuesto/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    CompCondPuesto.find({ comportamiento: regex, empresa: empresaB })
        .populate('empresa')
        .populate('competenciaConductual')
        .populate('puesto')
        .exec((err, compCondPuesto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                compCondPuesto
            });
        });
});

app.get("/compCondPuesto/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    CompCondPuesto.count({ estado: true }).exec((err, total) => {
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