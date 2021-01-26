const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Puesto = require('../models/puesto');
const Empresa = require('../models/empresa');
const Valorizacion = require('../models/valorizacion');


const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/valorizacion/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    Valorizacion.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('actividadPuesto') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate   
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, valorizacion) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                valorizacion
            });
        });
});


/* 
    Metodo para agregar valorizacions
*/
app.post('/valorizacion', verificaToken, function(req, res) {
    let body = req.body;

    let valorizacion = new Valorizacion({
        descripcion: body.descripcion,
        empresa: body.empresa,
        puesto: body.puesto,
        actividadPuesto: body.actividadPuesto
    });

    valorizacion.save((err, valorizacionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            valorizacion: valorizacionDB
        });
    });
});

/*
    Método para modificar la valoriacion
*/
app.put('/valorizacion/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion', 'actividadPuesto']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    Valorizacion.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, valorizacionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            valorizacion: valorizacionDB
        });
    });
});

/* 
    Método para buscar los valorizacions de una empresa
*/
app.get('/valorizacion/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Valorizacion.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .populate('puesto')
        .exec((err, valorizacion) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                valorizacion
            });
        });
});

app.get("/valorizacion/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    Valorizacion.count({ estado: true }).exec((err, total) => {
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