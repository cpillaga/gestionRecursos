const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let expPuestoSchema = new Schema({
    area: {
        type: String,
        required: false
    },
    tiempo: {
        type: String,
        required: false
    },
    especificidad: {
        type: String,
        required: false
    },
    experiencia: {
        type: Schema.Types.ObjectId,
        ref: 'Experiencia',
        required: false
    },
    puesto: {
        type: Schema.Types.ObjectId,
        ref: 'Puesto',
        required: [true, 'El puesto es obligatorio']
    },
    estado: {
        type: String,
        default: true,
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

module.exports = mongoose.model('ExpPuesto', expPuestoSchema);