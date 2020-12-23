const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let grupoOcpSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    minVal: {
        type: Number,
        required: [true, 'El valor míniimo es obligatorio']
    },
    maxVal: {
        type: Number,
        required: [true, 'El valor máximo es obligatorio']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

module.exports = mongoose.model('GrupoOcp', grupoOcpSchema);