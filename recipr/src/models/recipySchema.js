const mongoose = require("mongoose");




const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [{
        type: String,
        required: true
    }],
    instructions: [{
        type: String,
        required: true
    }],
    image: { 
        type: String, 
        required: true
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user",
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    comments: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'comment' 
        }
    ], 
}, {
    timestamps: true
});

const Recipy = mongoose.model("Recipe", recipeSchema);

module.exports = Recipy