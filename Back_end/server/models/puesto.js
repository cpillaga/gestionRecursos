const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let puestoSchema = new Schema({
    codigo: {
        type: String,
        // unique: true,
        required: false
    },
    denominacion: {
        type: String,
        required: false
    },
    estado: {
        type: String,
        default: true
    },
    mision: {
        type: String,
        required: false
    },
    nivel: {
        type: String,
        required: false
    },
    unidadAdmin: {
        type: String,
        required: false
    },
    RIE: {
        type: String,
        required: false
    },
    grado: {
        type: String,
        required: false
    },
    capacitacion: {
        type: String,
        required: [true, 'La capacitacion es obligatoria']
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        required: false
    },
    grupoOcupacional: {
        type: String,
        default: 'S/N'
    },
    ambito: {
        type: Schema.Types.ObjectId,
        ref: 'Ambito',
        required: false
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

// puestoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Puesto', puestoSchema);