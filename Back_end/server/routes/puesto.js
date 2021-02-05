const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Puesto = require('../models/puesto');
const Empresa = require('../models/empresa');
const Rol = require('../models/rol');
const Ambito = require('../models/ambito');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/puesto/:idEmp', verificaToken, function(req, res) {
    let ide = req.params.idEmp;
    // let idr = req.params.idRol;
    // let idg = req.params.idGrp;
    // let ida = req.params.idAmb;

    Puesto.find({ empresa: ide /*, rol: idr, grupoOcupacional: idg, ambito: ida */ })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('ambito') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('rol') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, puesto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                puesto
            });
        });
});


/* 
    Metodo para agregar puestos
*/
app.post('/puesto', verificaToken, function(req, res) {
    let body = req.body;

    let puesto = new Puesto({

        codigo: body.codigo,
        denominacion: body.denominacion,
        mision: body.mision,
        nivel: body.nivel,
        unidadAdmin: body.unidadAdmin,
        RIE: body.RIE,
        capacitacion: body.capacitacion,
        rol: body.rol,
        grupoOcupacional: body.grupoOcupacional,
        ambito: body.ambito,
        empresa: body.empresa

    });

    puesto.save((err, puestoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            puesto: puestoDB
        });
    });
});

/*
    Método para modificar puesto
*/
app.put('/puesto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['codigo', 'denominacion', 'mision', 'nivel', 'unidadAdmin', 'rol', 'ambito', 'RIE', 'capacitacion', 'grupoOcupacional']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    Puesto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, puestoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            puesto: puestoDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/puesto/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    Puesto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, puestoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!puestoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Puesto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            puesto: puestoBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/puesto/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Puesto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, puestoActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!puestoActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Grupo Ocupacional  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            puesto: puestoActivado
        });
    });
});

/* 
    Método para buscar los puestos de una empresa
*/
app.get('/puesto/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Puesto.find({ denominacion: regex, empresa: empresaB })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('ambito') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('rol')
        .exec((err, puesto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                puesto
            });
        });
});

app.get("/puesto/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    Puesto.count({ estado: true }).exec((err, total) => {
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