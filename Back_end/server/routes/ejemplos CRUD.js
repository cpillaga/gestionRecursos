const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Empleado = require('../models/empleado');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
const { xmlGenerate } = require('../middlewares/xmlConvert');
app.use(cors({ origin: '*' }));


/*
    Método para logueo
*/
app.post('/empleado/login', function(req, res) {
    let body = req.body;

    Empleado.findOne({ usuario: body.usuario, estado: true }, (err, empleadoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Empleado',
                errors: err
            });
        }

        if (!empleadoDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.clave, empleadoDB.clave)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        //Crear un token!!

        empleadoDB.clave = 'null';

        var token = jwt.sign({ empleado: empleadoDB }, SEED); //8 horas

        Empresa.find({ _id: empleadoDB.empresa }, (err, empresaDB) => {



            res.json({
                ok: true,
                empleado: empleadoDB,
                empresa: empresaDB,
                token: token
            });
        });

    });
});

/*
    Método para obntener todos los campos de una tabla de una empresa
*/
app.get('/empleado/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    Empleado.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .populate('nombre campo de tabla foranea')
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, empleado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            empleado.clave = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                empleado
            });
        });
});

/*
    Metodo para obtener la informacion de un empleado por Id, que pertenece a una empresa
*/
app.get('/empleadoID/:idEmp/:empleado', verificaToken, function(req, res) {
    let id = req.params.idEmp;
    let empleado = req.params.empleado;

    Empleado.find({ empresa: id, _id: empleado })
        .populate('empresa')
        .sort({ estado: -1 })
        .exec((err, empleado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            empleado.clave = null;

            res.json({
                ok: true,
                empleado
            });
        });
});

/* 
    Metodo para agregar empleados
*/
app.post('/empleado', verificaToken, function(req, res) {
    let body = req.body;

    let empleado = new Empleado({
        nombre: body.nombre,
        telefono: body.telefono,
        direccion: body.direccion,
        correo: body.correo,
        clave: bcrypt.hashSync(body.clave, 10),
        rol: body.rol,
        empresa: body.empresa,
        usuario: body.usuario
    });

    empleado.save((err, empleadoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        empleado.clave = 'null';

        res.json({
            ok: true,
            empleado: empleadoDB
        });
    });
});

/*
    Método para modificar empleados
*/
app.put('/empleado/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'telefono', 'direccion', 'correo', 'clave', 'rol', 'empresa', 'estado']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando
    if (body.clave != null) {
        body.clave = bcrypt.hashSync(body.clave, 10);
    }

    Empleado.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, empleadoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        empleadoDB.clave = null;
        res.json({
            ok: true,
            empleado: empleadoDB
        });
    });
});

/*
    Método par restablecer una contraseña
*/
app.put('/empleado/resetPsw/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['clave']);

    if (body.clave != null) {
        body.clave = bcrypt.hashSync(body.clave, 10);
    }

    Empleado.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, empleadoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        empleadoDB.clave = null;

        res.json({
            ok: true,
            empleado: empleadoDB
        });
    });
});

/* 
    Método para dar de baja a un empleado
*/
app.delete('/empleado/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    Empleado.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, empleadoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!empleadoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empleado no encontrado'
                }
            });
        }

        empleadoBorrado.password = null;
        res.json({
            ok: true,
            empleado: empleadoBorrado
        });
    });
});

/* 
    Método para habiñitar a un empleado
*/
app.delete('/empleado/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Empleado.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, empleadoActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!empleadoActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empleado no encontrado'
                }
            });
        }

        empleadoActivado.password = null;
        res.json({
            ok: true,
            empleado: empleadoActivado
        });
    });
});

/* 
    Método para buscar empleados de una empresa por nombre 
*/
app.get('/empleado/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Empleado.find({ nombre: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, empleado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            empleado.clave = null;

            res.json({
                ok: true,
                empleado
            });
        });
});

module.exports = app;

//No olvidarse de poner la ruta en el index.js