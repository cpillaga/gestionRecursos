const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let valorizacionSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },

    actividadPuesto: {
        type: Schema.Types.ObjectId,
        ref: 'ActPuesto',
        required: [true, 'la actividad puesto es obligatorio']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

module.exports = mongoose.model('Valorizacion', valorizacionSchema);