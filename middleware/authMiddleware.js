const jwt = require('jsonwebtoken')
const User = require('../models/User')
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    if(token) { // if jwt exists
        jwt.verify(token, process.env.SESSION_SECRET, (error, decodedToken) => {   // if jwt is valid
            if(error) {
                res.redirect('/auth/signin')
            } else {
                next()
            }
        })

    } else {
        res.redirect('/auth/signin')
    }
}

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, process.env.SESSION_SECRET, async (error, decodedToken) => {   // if jwt is valid
            if(error) {
                res.locals.user = null
                next()
            } else {
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = { requireAuth, checkUser }