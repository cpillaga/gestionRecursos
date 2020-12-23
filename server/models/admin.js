const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let adminSchema = new Schema({
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    clave: {
        type: String,
        required: [true, 'La clave es obligatoria']
    }
});

adminSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Admin', adminSchema);