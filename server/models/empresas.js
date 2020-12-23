const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let empresaSchema = new Schema({
    ruc: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    razonSocial: {
        type: String,
        required: [true, 'La razón social es obligatoria']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },
    img: {
        type: String,
        default: 'facImg.png'
    },
    fechaIngreso: {
        type: Date,
        required: [true, 'La fecha de ingreso es obligatoria']
    },
    estado: {
        type: Boolean,
        default: true
    },
    estadoPago: {
        type: Boolean,
        default: true
    }
});

empresaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Empresa', empresaSchema);