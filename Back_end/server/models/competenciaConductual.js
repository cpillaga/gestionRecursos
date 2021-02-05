const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let competenciaConductualSchema = new Schema({
    numero: {
        type: String,
        required: false
    },
    denominacion: {
        type: String,
        required: false
    },
    definicion: {
        type: String,
        required: false
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    },
    estado: {
        type: String,
        default: true,
    }

});

module.exports = mongoose.model('CompetenciaConductual', competenciaConductualSchema);