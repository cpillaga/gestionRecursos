const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const CompetenciaTecnica = require('../models/competenciaTecnica');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/competenciaTecnica/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    CompetenciaTecnica.find({ empresa: id })
        .populate('empresa')
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, competenciaTecnica) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                competenciaTecnica
            });
        });
});


/* 
    Metodo para agregar ambitos
*/
app.post('/competenciaTecnica', verificaToken, function(req, res) {
    let body = req.body;

    let competenciaTecnica = new CompetenciaTecnica({
        denominacion: body.denominacion,
        definicion: body.definicion,
        numero: body.numero,
        empresa: body.empresa
    });

    competenciaTecnica.save((err, competenciaTecnicaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            competenciaTecnica: competenciaTecnicaDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/competenciaTecnica/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['numero', 'denominacion', 'definicion']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    CompetenciaTecnica.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, competenciaTecnicaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            competenciaTecnica: competenciaTecnicaDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/competenciaTecnica/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    CompetenciaTecnica.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, competenciaTecnicaBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!competenciaTecnicaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'competenciaTecnica no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            competenciaTecnica: competenciaTecnicaBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/competenciaTecnica/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    CompetenciaTecnica.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, competenciaTecnicaActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!competenciaTecnicaActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Competencia Tecnica  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            competenciaTecnica: competenciaTecnicaActivado
        });
    });
});

/* 
    Método para buscar los competenciaTecnicas de una empresa
*/
app.get('/competenciaTecnica/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    CompetenciaTecnica.find({ denominacion: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, competenciaTecnica) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                competenciaTecnica
            });
        });
});

app.get("/competenciaTecnica/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    CompetenciaTecnica.count({ estado: true }).exec((err, total) => {
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