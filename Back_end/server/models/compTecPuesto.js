const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let compTecPuestoSchema = new Schema({
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: [true, 'La empresa es obligatoria']
    },
    estado: {
        type: String,
        default: true,
    },
    puesto: {
        type: Schema.Types.ObjectId,
        ref: 'Puesto',
        required: false
    },
    competenciaTecnica: {
        type: Schema.Types.ObjectId,
        ref: 'ComptenciaTecnica',
        required: false
    }
});

module.exports = mongoose.model('CompTecPuesto', compTecPuestoSchema);