import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gamesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    release: {
        type: Date
    },
    pegi: {
        type: Number,
        required: true
    },
    developer: {
        type: String
    },
    cover: {
        type: String
    },
    price: {
        type: Number
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Categories'
    }
},
    { versionKey: false }
);

gamesSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});

const Games = mongoose.model('Games', gamesSchema);
export default Games;