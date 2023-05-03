import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        default: 'no description'
    }
}, 
{ versionKey: false }
);

categoriesSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});

const Categories =  mongoose.model('Categories', categoriesSchema);
export default Categories;