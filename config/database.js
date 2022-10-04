const mongoose = require('mongoose')
require('dotenv').config()

/**
 * ------------- DATABASE -------------
 */

// Connect to MongoDB Server using the connection string in the `.env` file

const dbConnectionString = process.env.DB_CONNECTION_STRING
const dbConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const dbConnection = mongoose.createConnection(dbConnectionString, dbConnectionOptions)

module.exports = dbConnection