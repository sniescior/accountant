const session = require('express-session')
const express = require('express')

const path = require('path')

const appRouter = require('./routes/appRouter')

const MongoStore = require('connect-mongo')

const passport = require('passport')

/**
 * ------------- GENERAL SETUP -------------
 */

// Gives access to variables set in the `.env` file
require('dotenv').config()

// Create the Express app
const app = express()

// Middleware for parsing Http responses
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// View engine
app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, 'public')))

/**
 * ------------- SESSION SETUP -------------
 */

const sessionStore = MongoStore.create({
    mongoUrl: process.env.DB_CONNECTION_STRING,
    collectionName: 'sessions'
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

/**
 * ------------- PASSPORT AUTHENTICATION -------------
 */

require('./config/passport')

app.use(passport.initialize())
app.use(passport.session())
 
 
/**
 * ------------- ROUTES -------------
 */

app.use(appRouter)
 
/**
 * ------------- SERVER -------------
 */

var listener = app.listen(3000, (e) => {
    console.log(`App is listening on http://localhost:${listener.address().port}`);
})
