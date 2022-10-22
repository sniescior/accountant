const mongoose = require('mongoose')
const dbConnection = require('../config/database')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        first: String,
        last: String
    },
    password: {
        passwordHash: String,
        salt: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
})

const User = dbConnection.model('User', userSchema)
module.exports = User