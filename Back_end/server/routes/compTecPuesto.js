const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const CompTecPuesto = require('../models/compTecPuesto');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/compTecPuesto/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    CompTecPuesto.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('competenciaTecnica')
        .populate('puesto')
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, compTecPuesto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                compTecPuesto
            });
        });
});


/* 
    Metodo para agregar ambitos
*/
app.post('/compTecPuesto', verificaToken, function(req, res) {
    let body = req.body;

    let compTecPuesto = new CompTecPuesto({
        puesto: body.puesto,
        competenciaTecnica: body.competenciaTecnica,
        empresa: body.empresa
    });

    compTecPuesto.save((err, compTecPuestoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            compTecPuesto: compTecPuestoDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/compTecPuesto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['puesto', 'competenciaTecnica']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    CompTecPuesto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, compTecPuestoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            compTecPuesto: compTecPuestoDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/compTecPuesto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    CompTecPuesto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, compTecPuestoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!compTecPuestoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'compTecPuesto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            compTecPuesto: compTecPuestoBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/compTecPuesto/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    CompTecPuesto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, compTecPuestoActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!compTecPuestoActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Competencia Tecnica  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            compTecPuesto: compTecPuestoActivado
        });
    });
});

/* 
    Método para buscar los compTecPuestos de una empresa
*/
app.get('/compTecPuesto/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    CompTecPuesto.find({ comportamiento: regex, empresa: empresaB })
        .populate('empresa')
        .populate('comptetenciaTecnica')
        .populate('puesto')
        .exec((err, compTecPuesto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                compTecPuesto
            });
        });
});

app.get("/compTecPuesto/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    CompTecPuesto.count({ estado: true }).exec((err, total) => {
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