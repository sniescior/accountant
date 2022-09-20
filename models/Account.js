const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    }
})

module.exports = accountSchema