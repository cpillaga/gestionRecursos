const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let compCondPuestoSchema = new Schema({
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
    estado: {
        type: String,
        default: true,
    },
    competenciaConductual: {
        type: Schema.Types.ObjectId,
        ref: 'CompetenciaConductual',
        required: false
    }
});

module.exports = mongoose.model('CompCondPuesto', compCondPuestoSchema);