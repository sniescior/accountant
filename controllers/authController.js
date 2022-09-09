const User = require('../models/User')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const handleErrors = async (username, email, password, confirmPassword) => {
    var errorMessages = {'username': false, 'email': false, 'password': false, 'confirmPassword': false}
    
    const sameUsernameUser = await User.findOne({'username': username})
    if(sameUsernameUser) {
        errorMessages['username'] = true
    } 
    
    const sameEmailUser = await User.findOne({'email': email})
    if (sameEmailUser) {
        errorMessages['email'] = true
    }

    if(password.length < 8) {
        errorMessages['password'] = true
    }

    return errorMessages
}

const maxAge = 3 * 24 * 60 * 60 // 3 days in seconds

const createToken = (id) => {
    return jwt.sign({id}, 'super confidential secret', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    var errorMessages = {'username': false, 'email': false, 'password': false, 'confirmPassword': false}
    res.render('auth/signup', { csrfToken: req.csrfToken(), errors: errorMessages, email: '', username: '' })
}

module.exports.signin_get = (req, res) => {
    res.render('auth/signin', { csrfToken: req.csrfToken() })
}

module.exports.signup_post = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body

    if(password == confirmPassword) {
        try {
            const user = await User.create({ username, email, password })

            const token = createToken(user._id)
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

            res.status(201) // success status
            res.send('signed up')
        } catch (error) {
            res.status(400) // error status
            var errorMessages = await handleErrors(username, email, password, confirmPassword)
            
            res.render('auth/signup', { csrfToken: req.csrfToken(), errors: errorMessages, email: email, username: username })
        }
    } else {
        var errors = {'confirmPassword': 'Password doesn\'t match'}
        res.status(400)
        res.render('auth/signup', { csrfToken: req.csrfToken(), errors: errors, email: email, username: username })
    }
}

module.exports.signin_post = async (req, res) => {
    const { username, password } = req.body
    
    try {
        console.log('Sign-in attempt')
        console.log(req.body);
        res.send('Not yet implemented. But nice try.')
    } catch (error) {
        console.log(error)
        res.send('Internal error')
    }
}