const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let compCondObsSchema = new Schema({
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
    competenciaConductual: {
        type: Schema.Types.ObjectId,
        ref: 'CompetenciaConductual',
        required: false
    }
});

module.exports = mongoose.model('CompCondObs', compCondObsSchema);