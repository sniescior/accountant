const mongoose = require('mongoose')
const dbConnection = require('../config/database')

const expenseCategorySchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: false
    }
})

const expenseCategory = dbConnection.model('expenseCategory', expenseCategorySchema)
module.exports = expenseCategory