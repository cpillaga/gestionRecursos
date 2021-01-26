const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Usuario = require('../models/usuario');
const Empresa = require('../models/empresa');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));


/*
    Método para logueo
*/
app.post('/usuario/login', function(req, res) {
    let body = req.body;

    Usuario.findOne({ usu: body.usu, estado: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        //Crear un token!!

        usuarioDB.password = 'null';

        var token = jwt.sign({ usuario: usuarioDB }, SEED); //8 horas

        Empresa.find({ _id: usuarioDB.empresa }, (err, empresaDB) => {



            res.json({
                ok: true,
                usuario: usuarioDB,
                empresa: empresaDB,
                token: token
            });
        });

    });
});

/*
    Método para obntener todos los campos de una tabla de una empresa
*/
app.get('/usuario/:idEmp', verificaToken, function(req, res) {
    let id = req.params.idEmp;

    Usuario.find({ empresa: id })
        .populate('empresa') //Se filtra todos los datos de las claves foraneas aquí se puede agregar varios populate
        .sort({ estado: -1 }) //El sort sirve para ordenar si no se le pone se ordena ascendente
        .exec((err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            usuario.password = null; //Aqui se pone null para que no devuelva la clave del usuario.

            res.json({
                ok: true,
                usuario
            });
        });
});

/*
    Metodo para obtener la informacion de un empleado por Id, que pertenece a una empresa
*/
app.get('/usuarioID/:idEmp/:usuario', verificaToken, function(req, res) {
    let id = req.params.idEmp;
    let usuario = req.params.usuario;

    Usuario.find({ empresa: id, _id: usuario })
        .populate('empresa')
        .sort({ estado: -1 })
        .exec((err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            usuario.password = null;


            res.json({
                ok: true,
                usuario
            });
        });
});

/* 
    Metodo para agregar usuarios
*/
app.post('/usuario', verificaToken, function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        rol: body.rol,
        usu: body.usu,
        correo: body.correo,
        password: bcrypt.hashSync(body.password, 10),
        empresa: body.empresa,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        usuario.password = 'null';

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

/*
    Método para modificar usuarios
*/
app.put('/usuario/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'usu', 'correo', 'rol']); //Dentro de los corchetes va los campos a modificarse

    //Condicion para saber si la clave se esta modificando
    if (body.password != null) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

/*
    Método par restablecer una contraseña
*/
app.put('/usuario/resetPsw/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['password']);

    if (body.password != null) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

/* 
    Método para dar de baja a un empleado
*/
app.delete('/usuario/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "false"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => { Find>ByAndRemove elimina al campo se puede reemplazar por la linea de abajo
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        usuarioBorrado.password = null;

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

/* 
    Método para habiñitar a un usuario
*/
app.delete('/usuario/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: "true"
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioActivado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioActivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        usuarioActivado.password = null;
        res.json({
            ok: true,
            usuario: usuarioActivado
        });
    });
});

/* 
    Método para buscar empleados de una usuario por nombre 
*/
app.get('/usuario/buscar/:termino/:empresa', verificaToken, function(req, res) {
    let terminoB = req.params.termino;
    let regex = new RegExp(terminoB, "i");
    let empresaB = req.params.empresa;

    Usuario.find({ nombre: regex, empresa: empresaB })
        .populate('empresa')
        .exec((err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            usuario.password = null;

            res.json({
                ok: true,
                usuario
            });
        });
});

module.exports = app;

//No olvidarse de poner la ruta en el index.js