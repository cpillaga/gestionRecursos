const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let expPuestoSchema = new Schema({
    area: {
        type: String,
        required: [true, 'El área es obligatorio']
    },
    tiempo: {
        type: String,
        required: [true, 'El tiempo es obligatoria']
    },
    especificidad: {
        type: String,
        required: [true, 'El especificidad es obligatoria']
    },
    experiencia: {
        type: Schema.Types.ObjectId,
        ref: 'Experiencia',
        required: [true, 'La experiencia es obligatoria']
    },
    puesto: {
        type: Schema.Types.ObjectId,
        ref: 'Puesto',
        required: [true, 'El puesto es obligatorio']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

module.exports = mongoose.model('ExpPuesto', expPuestoSchema);