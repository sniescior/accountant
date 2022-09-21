const mongoose = require('mongoose')
const accountSchema = require('./Account')

const accountsGroupSchema = new mongoose.Schema({
    "groupName": {
        type: String,
        required: true
    },
    "accounts": [
        accountSchema
    ]
})

module.exports = accountsGroupSchema