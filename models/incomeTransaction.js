const mongoose = require('mongoose')
const dbConnection = require('../config/database')

const incomeTransactionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    incomeCategoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'incomeCategory',
        required: true
    },
    amount: {
        type: Number,
        default: 0,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    }
})

const incomeTransaction = dbConnection.model('incomeTransaction', incomeTransactionSchema)
module.exports = incomeTransaction