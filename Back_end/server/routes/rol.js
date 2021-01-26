const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Rol = require('../models/rol');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para obntener todos los campos de una tabla de una Rol
*/
app.get('/rol/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    Rol.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, rol) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //  proceso.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                rol
            });
        });
});


/* 
    Metodo para agregar roles
*/
app.post('/rol', verificaToken, function(req, res) {
    let body = req.body;
    console.log(body);
    let rol = new Rol({
        descripcion: body.descripcion,
        estado: body.estado,
        empresa: body.empresa
    });

    rol.save((err, rolDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            rol: rolDB
        });
    });
});

/*
    Método para modificar roles
*/
app.put('/rol/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando

    Rol.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, rolDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //actividadDB.clave = null;
        res.json({
            ok: true,
            rol: rolDB
        });
    });
});

/* 
    Método para dar de baja a un proceso
*/
app.delete('/rol/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    Rol.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, rolBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!rolBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Rol no encontrado'
                }
            });
        }

        // empleadoBorrado.password = null;
        res.json({
            ok: true,
            rol: rolBorrado
        });
    });
});

/* 
    Método para habilitar un rol
*/
app.delete('/rol/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Rol.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, rolActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!rolActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Rol no encontrado'
                }
            });
        }

        // empleadoActivado.password = null;
        res.json({
            ok: true,
            rol: rolActivado
        });
    });
});

/* 
    Método para buscar los roles de una empresa
*/
app.get('/rol/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Rol.find({ descripcion: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, rol) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // proceso.clave = null;
            res.json({
                ok: true,
                rol
            });
        });
});

app.get("/rol/contar/:idEmp", verificaToken, (req, res) => {
    let id = req.params.idEmp;

    Rol.count({ estado: true }).exec((err, total) => {
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