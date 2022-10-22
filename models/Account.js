const mongoose = require('mongoose')
const dbConnection = require('../config/database')

const accountSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    name: String,
    amount: Number
})

accountSchema.post('remove', (doc) => {
    console.log('Removed: ', doc);
})

const Account = dbConnection.model('Account', accountSchema)
module.exports = Account