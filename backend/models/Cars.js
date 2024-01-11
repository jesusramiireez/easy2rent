import mongoose from "mongoose";
const Schema = mongoose.Schema;

const carsSchema = new Schema({
    nombre: {
        type: String
    },
    matricula: {
        type: String,
        required: true
    },
    precio: {
        type: Number
    },
    plazas: {
        type: Number
    },
    puertas: {
        type: Number
    },
    marca: {
        type: mongoose.Schema.ObjectId,
        ref: 'Marcas'
    },
    cambio: {
        type: String
    }
},
    { versionKey: false }
);

carsSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});

const Cars = mongoose.model('Cars', carsSchema);
export default Cars;