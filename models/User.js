const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = mongoose.Schema({
    "username": {
        type: String,
        required: [true, 'Username is required'], // [<actual value>, <error message if field fails>]
        unique: true,
    },
    "email": {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [isEmail, 'Please enter a valid email address'],
        lowercase: true
    },
    "password": {
        type: String,
        required: [true, 'Please set your password'],
        minlength: [8, 'Password should have at least 8 characters']
    }
})

const User = mongoose.model('user', userSchema)

module.exports = User