const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let procesoSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    estado: {
        type: String,
        default: true,
        required: [true, 'La descripción es obligatoria']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

module.exports = mongoose.model('Proceso', procesoSchema);