const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let actividadCargoSchema = new Schema({
    descripcion: {
        type: String,
        required: false
    },
    fr: {
        type: String,
        required: false
    },
    co: {
        type: String,
        required: false
    },
    cm: {
        type: String,
        required: false
    },
    total: {
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
    },
    puesto: {
        type: Schema.Types.ObjectId,
        ref: 'Puesto',
        required: false
    }
});

module.exports = mongoose.model('ActividadCargo', actividadCargoSchema);