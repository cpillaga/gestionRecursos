const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let puestoSchema = new Schema({
    codigo: {
        type: String,
        required: [true, 'El código es obligatorio']
    },
    denominacion: {
        type: String,
        required: [true, 'La denominacion es obligatorio']
    },
    estado: {
        type: String,
        default: true,
        required: [true, 'El estado es obligatorio']
    },
    mision: {
        type: String,
        required: [true, 'La mision es obligatoria']
    },
    nivel: {
        type: String,
        required: [true, 'El nivel es obligatorio']
    },
    unidadAdmin: {
        type: String,
        required: [true, 'La unidad de administrativa es obligatoria']
    },
    RIE: {
        type: String,
        required: [true, 'Relaciones Internas y Externas es obligatorio']
    },
    capacitacion: {
        type: String,
        required: [true, 'La capacitacion es obligatoria']
    },
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        required: [true, 'El rol es obligatorio']
    },
    grupoOcupacional: {
        type: Schema.Types.ObjectId,
        ref: 'GrupoOcp',
        required: [true, 'El grupo ocupacional es obligatorio']
    },
    ambito: {
        type: Schema.Types.ObjectId,
        ref: 'Ambito',
        required: [true, 'El ámbito es obligatorio']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

module.exports = mongoose.model('Puesto', puestoSchema);