const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let actividadPuestoSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    tipo: {
        type: String,
        required: [true, 'El tipo es obligatorio']
    },
    actividad: {
        type: Schema.Types.ObjectId,
        ref: 'Actividad',
        required: [true, 'La actividad es obligatoria']
    },
    puesto: {
        type: Schema.Types.ObjectId,
        ref: 'Puesto',
        required: [true, 'El puesto es obligatorio']
    },
    estado: {
        type: String,
        default: true
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

module.exports = mongoose.model('ActPuesto', actividadPuestoSchema);