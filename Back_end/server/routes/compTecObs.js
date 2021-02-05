const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const CompTecObs = require('../models/compTecObs');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/compTecObs/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    CompTecObs.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('competenciaTecnica')
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, compTecObs) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                compTecObs
            });
        });
});


/* 
    Metodo para agregar ambitos
*/
app.post('/compTecObs', verificaToken, function(req, res) {
    let body = req.body;

    let compTecObs = new CompTecObs({
        comportamiento: body.comportamiento,
        numero: body.numero,
        nivel: body.nivel,
        competenciaTecnica: body.competenciaTecnica,
        empresa: body.empresa
    });

    compTecObs.save((err, compTecObsDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            compTecObs: compTecObsDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/compTecObs/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['numero', 'nivel', 'comportamiento', 'competenciaTecnica']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    CompTecObs.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, compTecObsDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            compTecObs: compTecObsDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/compTecObs/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    CompTecObs.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, compTecObsBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!compTecObsBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'compTecObs no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            compTecObs: compTecObsBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/compTecObs/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    CompTecObs.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, compTecObsActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!compTecObsActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Competencia Tecnica  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            compTecObs: compTecObsActivado
        });
    });
});

/* 
    Método para buscar los compTecObss de una empresa
*/
app.get('/compTecObs/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    CompTecObs.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, compTecObs) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                compTecObs
            });
        });
});

app.get("/compTecObs/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    CompTecObs.count({ estado: true }).exec((err, total) => {
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