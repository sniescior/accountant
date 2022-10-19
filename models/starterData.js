const mongoose = require('mongoose')
const dbConnection = require('../config/database')

const starterDataSchema = new mongoose.Schema({
    "incomecategories": [
        {
            "name": String
        }
    ],
    "expensecategories": [
        {
            "name": String
        }
    ],
    "accountgroups": [
        {
            "name": String,
            "accounts": [
                {
                    "name": String,
                    "amount": Number
                }
            ]
        }
    ]
})

const starterData = dbConnection.model('starterData', starterDataSchema)
module.exports = starterData