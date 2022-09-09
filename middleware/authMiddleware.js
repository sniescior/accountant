const jwt = require('jsonwebtoken')

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

module.exports = { requireAuth }