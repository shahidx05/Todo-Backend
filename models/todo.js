const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    check: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Todo", todoSchema)