const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let experienciaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    grado: {
        type: String,
        required: [true, 'El grado es obligatoria']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

module.exports = mongoose.model('Experiencia', experienciaSchema);