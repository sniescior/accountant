const mongoose = require('mongoose')
const dbConnection = require('../config/database')

const expenseTransactionSchema = new mongoose.Schema({
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
    expenseCategoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'expenseCategory',
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

const expenseTransaction = dbConnection.model('expenseTransaction', expenseTransactionSchema)
module.exports = expenseTransaction