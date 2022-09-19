const { default: mongoose } = require("mongoose");

const expenseCategorySchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true,
        unique: true
    },
    "budget": {
        type: Number,
        required: false
    }
})

module.exports = expenseCategorySchema