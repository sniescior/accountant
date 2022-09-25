const { default: mongoose } = require("mongoose");

const incomeCategorySchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true,
    }
})

module.exports = incomeCategorySchema