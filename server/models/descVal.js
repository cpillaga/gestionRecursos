const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let descValSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    observacion: {
        type: String,
        required: [true, 'La observacion es obligatoria']
    },
    calificacion: {
        type: String,
        required: [true, 'La calificacion es obligatoria']
    },
    valorizacion: {
        type: Schema.Types.ObjectId,
        ref: 'Valorizacion',
        required: [true, 'La valorizacion es obligatoria']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

module.exports = mongoose.model('Valorizacion', descValSchema);