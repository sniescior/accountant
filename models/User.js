const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

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

// mongoose hooks
// fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
    console.log('New user was created and saved', doc);
    next()
})

// fire a function before user was saved to the db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    console.log('user about to be created and saved', this);
    next()
})

const User = mongoose.model('user', userSchema)

module.exports = User