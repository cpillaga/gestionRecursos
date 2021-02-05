const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let actividadEsencialSchema = new Schema({
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
    },
    puesto: {
        type: Schema.Types.ObjectId,
        ref: 'Puesto',
        required: false
    },
    conocimientoAdicional: {
        type: Schema.Types.ObjectId,
        ref: 'ConocimientoAdicional',
        required: false
    }

});

module.exports = mongoose.model('ActividadEsencial', actividadEsencialSchema);