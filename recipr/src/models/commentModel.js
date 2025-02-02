const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    recipe:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "recipe"
    }
})


const comment = mongoose.model("comment", commentSchema);

module.exports = comment