const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ambitoSchema = new Schema({
    descripcion: {
        type: String,
        required: false
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

module.exports = mongoose.model('Ambito', ambitoSchema);