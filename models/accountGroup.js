const mongoose = require('mongoose')
const dbConnection = require('../config/database')

const accountGroupSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    groupName: {
        type: String,
        required: true
    },
    accounts: [{ 
        _id: false,
        accountID: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' } 
    }]
})

const accountGroup = dbConnection.model('accountGroup', accountGroupSchema)
module.exports = accountGroup