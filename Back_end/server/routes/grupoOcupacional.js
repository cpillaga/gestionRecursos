const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const GrupoOcp = require('../models/grupoOcupacional');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/grupoOcp/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    GrupoOcp.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('descVal')
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, grupoOcp) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                grupoOcp
            });
        });
});


/* 
    Metodo para agregar grupos
*/
app.post('/grupoOcp', verificaToken, function(req, res) {
    let body = req.body;

    let grupoOcp = new GrupoOcp({
        descripcion: body.descripcion,
        minVal: body.minVal,
        maxVal: body.maxVal,
        estado: body.estado,
        empresa: body.empresa
    });

    grupoOcp.save((err, grupoOcpDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            grupoOcp: grupoOcpDB
        });
    });
});

/*
    Método para modificar Grupos Ocupacionales
*/
app.put('/grupoOcp/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion', 'minVal', 'maxVal']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    GrupoOcp.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, grupoOcpDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            grupoOcp: grupoOcpDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/grupoOcp/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    GrupoOcp.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, grupoOcpBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!grupoOcpBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Grupo Ocupacional no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            grupoOcp: grupoOcpBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/grupoOcp/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    GrupoOcp.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, grupoOcpActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!grupoOcpActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Grupo Ocupacional  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            grupoOcp: grupoOcpActivado
        });
    });
});

/* 
    Método para buscar los grupos de una empresa
*/
app.get('/grupoOcp/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    GrupoOcp.find({ descripcion: regex, empresa: empresaB })

    .populate('empresa')
        .exec((err, grupoOcp) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                grupoOcp
            });
        });
});
app.get("/grupoOcp/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    GrupoOcp.count({ estado: true }).exec((err, total) => {
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