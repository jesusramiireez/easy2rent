import mongoose from "mongoose";
const Schema = mongoose.Schema;

const marcasSchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, 
{ versionKey: false }
);

marcasSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});

const Marcas =  mongoose.model('Marcas', marcasSchema);
export default Marcas;