const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es obligatorio']
    },
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    },
    usu: {
        type: String,
        unique: true,
        required: [true, 'El usuario es obligatorio']
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: [true, 'La clave es obligatoria']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

//adminSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);