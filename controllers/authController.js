const User = require('../models/User')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const signupErrors = async (username, email, password) => {
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
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, 'super confidential secret', (error, decodedToken) => {   // if jwt is valid
            if(error) {
                res.render('auth/signup', { csrfToken: req.csrfToken(), errors: errorMessages, email: '', username: '' })
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.render('auth/signup', { csrfToken: req.csrfToken(), errors: errorMessages, email: '', username: '' })
    }
}

module.exports.signin_get = (req, res) => {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, 'super confidential secret', (error, decodedToken) => {   // if jwt is valid
            if(error) {
                res.render('auth/signin', { csrfToken: req.csrfToken(), 'error': null, 'email': '' })
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.render('auth/signin', { csrfToken: req.csrfToken(), 'error': null, 'email': '' })
    }
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
            var errorMessages = await signupErrors(username, email, password)
            
            res.render('auth/signup', { csrfToken: req.csrfToken(), errors: errorMessages, email: email, username: username })
        }
    } else {
        var errors = {'confirmPassword': 'Password doesn\'t match'}
        res.status(400)
        res.render('auth/signup', { csrfToken: req.csrfToken(), errors: errors, email: email, username: username })
    }
}

module.exports.signin_post = async (req, res) => {
    const { email, password } = req.body
    
    try {
        const user = await User.login(email, password)

        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

        // res.status(200).json({user: user._id})
        // res.render('app/dashboard')
        return res.redirect('/app/dashboard')
    } catch (error) {
        res.status(400)
        res.render('auth/signin', { csrfToken: req.csrfToken(), error, 'email': email })
    }
}

module.exports.signout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}