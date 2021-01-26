const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

// ================================
//  Verificar Token
// ================================}
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token  no válido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};


let validarCedula = (req, res, next) => {
    let ci = req.body.ciRuc.toString().split('');

    if (ci.length > 10 || ci.length < 10) {
        return res.status(203).json({
            statusCode: 203,
            message: `Cédula no válida`
        });
    }

    let digitoRegion = Number(ci[0] + ci[1]);
    if (digitoRegion < 1 || digitoRegion > 24) {
        return res.status(203).json({
            statusCode: 203,
            message: `Cédula no válida`
        });
    }

    let tercerDigito = Number(ci[2]);
    if (tercerDigito < 0 || tercerDigito > 6) {
        return res.status(203).json({
            statusCode: 203,
            message: `Cédula no válida`
        });
    }

    let suma = 0;
    let val = 0;
    for (let i = 0; i < 9; i++) {
        if (i & 1) {
            val = ci[i] * 1;
            if (val >= 10) {
                val = val - 9;
            }
        } else {
            val = ci[i] * 2;
            if (val >= 10) {
                val = val - 9;
            }
        }
        suma += val;
    }

    suma = suma % 10 ? 10 - suma % 10 : 0;
    if (suma === Number(ci[ci.length - 1])) {
        next();
    } else {
        return res.status(203).json({
            statusCode: 203,
            message: `Cédula no válida`
        });
    }
};

module.exports = {
    verificaToken,
    validarCedula
};