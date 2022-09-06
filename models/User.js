const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    "username": {
        type: String,
        required: true,
        unique: true
    },
    "email": {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    "password": {
        type: String,
        required: true,
        minLength: 8
    }
})

const User = mongoose.model('user', userSchema)

module.exports = User