const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let puestoSchema = new Schema({
    codigo: {
        type: String,
        // unique: true,
        required: [true, 'El código es obligatorio']
    },
    denominacion: {
        type: String,
        required: [true, 'La denominacion es obligatorio']
    },
    estado: {
        type: String,
        default: true,
        required: [true, 'El estado es obligatorio']
    },
    mision: {
        type: String,
        required: [true, 'La mision es obligatoria']
    },
    nivel: {
        type: String,
        required: [true, 'El nivel es obligatorio']
    },
    unidadAdmin: {
        type: String,
        required: [true, 'La unidad de administrativa es obligatoria']
    },
    RIE: {
        type: String,
        required: [true, 'Relaciones Internas y Externas es obligatorio']
    },
    capacitacion: {
        type: String,
        required: [true, 'La capacitacion es obligatoria']
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        required: [true, 'El rol es obligatorio']
    },
    grupoOcupacional: {
        type: String,
        default: 'S/N'
    },
    ambito: {
        type: Schema.Types.ObjectId,
        ref: 'Ambito',
        required: [true, 'El ámbito es obligatorio']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

// puestoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Puesto', puestoSchema);