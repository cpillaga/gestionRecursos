const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const CompCondObs = require('../models/compCondObs');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/compCondObs/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    CompCondObs.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('competenciaConductual')
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, compCondObs) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                compCondObs
            });
        });
});


/* 
    Metodo para agregar ambitos
*/
app.post('/compCondObs', verificaToken, function(req, res) {
    let body = req.body;

    let compCondObs = new CompCondObs({
        comportamiento: body.comportamiento,
        numero: body.numero,
        nivel: body.nivel,
        competenciaConductual: body.competenciaConductual,
        empresa: body.empresa
    });

    compCondObs.save((err, compCondObsDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            compCondObs: compCondObsDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/compCondObs/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['numero', 'nivel', 'comportamiento', 'competenciaConductual']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    CompCondObs.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, compCondObsDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            compCondObs: compCondObsDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/compCondObs/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    CompCondObs.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, compCondObsBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!compCondObsBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'compCondObs no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            compCondObs: compCondObsBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/compCondObs/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    CompCondObs.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, compCondObsActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!compCondObsActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Competencia Tecnica  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            compCondObs: compCondObsActivado
        });
    });
});

/* 
    Método para buscar los compCondObss de una empresa
*/
app.get('/compCondObs/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    CompCondObs.find({ comportamiento: regex, empresa: empresaB })
        .populate('empresa')
        .populate('competenciaConductual')
        .exec((err, compCondObs) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                compCondObs
            });
        });
});

app.get("/compCondObs/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    CompCondObs.count({ estado: true }).exec((err, total) => {
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