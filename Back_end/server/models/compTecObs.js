const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let compTecObsSchema = new Schema({
    numero: {
        type: String,
        required: false
    },
    nivel: {
        type: String,
        required: false
    },
    comportamiento: {
        type: String,
        required: false
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    },
    competenciaTecnica: {
        type: Schema.Types.ObjectId,
        ref: 'CompetenciaTecnica',
        required: false
    }
});

module.exports = mongoose.model('CompTecObs', compTecObsSchema);