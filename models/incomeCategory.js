const mongoose = require('mongoose')
const dbConnection = require('../config/database')

const incomeCategorySchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    }
})

const incomeCategory = dbConnection.model('incomeCategory', incomeCategorySchema)
module.exports = incomeCategory