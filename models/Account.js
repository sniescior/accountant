const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "amount": {
        type: Number,
        required: false
    }
})

module.exports = accountSchema