const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const incomeCategorySchema = require('./IncomeCategory')
const expenseCategorySchema = require('./ExpenseCategory')
const accountsGroupSchema = require('./AccountGroup')

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
    },
    "expenseCategories": [
        expenseCategorySchema
    ],
    "incomeCategories": [
        incomeCategorySchema
    ],
    "accountGroups": [
        accountsGroupSchema
    ]
})

// mongoose hooks
// fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
    next()
})

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email })
    console.log(user)
    console.log('Takie hasełko: ', password)

    if(user) {
        const auth = bcrypt.compareSync(password, user.password)

        if(auth) {          // password match
            return user
        }
        throw Error('error')    // invalid password
    }
    throw Error('error')    // invalid email address
}

const User = mongoose.model('user', userSchema)

module.exports = User