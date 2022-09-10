const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    if(token) { // if jwt exists
        jwt.verify(token, 'super confidential secret', (error, decodedToken) => {   // if jwt is valid
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
        jwt.verify(token, 'super confidential secret', async (error, decodedToken) => {   // if jwt is valid
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