const mongoose = require('mongoose');

let Schema = mongoose.Schema;

//Actividad Puesto Competencia
let actPuesCompSchema = new Schema({
    actividad: {
        type: Schema.Types.ObjectId,
        ref: 'ActPuesto',
        required: [true, 'La actividad puesto es obligatoria']
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

module.exports = mongoose.model('ActPuesComp', actPuesCompSchema);