const User = require('../models/User')
const mongoose = require('mongoose')

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
    const { username, email, password } = req.body
    
    try {

    } catch (error) {

    }

    res.send('user login')
}