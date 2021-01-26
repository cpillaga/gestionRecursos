const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let descValSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    observacion: {
        type: String
    },
    calificacion: {
        type: String,
        required: [true, 'La calificacion es obligatoria']
    },
    subtitulo: {
        type: String
    },
    valorizacion: {
        type: Schema.Types.ObjectId,
        ref: 'Valorizacion',
        required: [true, 'La valorizacion es obligatoria']
    },
    grupoOcupacional: {
        type: Schema.Types.ObjectId,
        ref: 'GrupoOcupacional',
        required: [true, 'El grupo Ocupacional  es obligatorio']
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    }
});

module.exports = mongoose.model('DescValorizacion', descValSchema);