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

// If any problem with authentication occurs then 'remove' jwt auth token (e.g. user deletes their account)
const removeToken = (res) => {
    res.cookie('jwt', '', { maxAge: 1 })
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
                if(user != null) {
                    res.locals.user = user
                    next()
                } else {
                    // console.log('Token exists but user doesn\'t.')
                    res.locals.user = null
                    removeToken(res)
                    next()
                }
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = { requireAuth, checkUser }