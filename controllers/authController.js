const User = require('../models/User')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const startExpenseCategories = [
    {'name': 'Food'},
    {'name': 'Social Life'},
    {'name': 'Self-development'},
    {'name': 'Transportation'},
    {'name': 'Culture'},
    {'name': 'Household'},
    {'name': 'Apparel'},
    {'name': 'Beauty'},
    {'name': 'Health'},
    {'name': 'Education'},
    {'name': 'Gift'},
    {'name': 'Other'}
]

const startIncomeCategories = [
    {'name': 'Allowance'},
    {'name': 'Salary'},
    {'name': 'Petty Cash'},
    {'name': 'Bonus'},
    {'name': 'Other'},
]

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
    return jwt.sign({id}, process.env.SESSION_SECRET, {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    var errorMessages = {'username': false, 'email': false, 'password': false, 'confirmPassword': false}
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, process.env.SESSION_SECRET, (error, decodedToken) => {   // if jwt is valid
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
        jwt.verify(token, process.env.SESSION_SECRET, (error, decodedToken) => {   // if jwt is valid
            if(error) {
                res.render('auth/signin', { csrfToken: req.csrfToken(), 'error': null, 'email': '', 'user': null })
            } else {
                res.redirect('/')
            }
        })
    } else {
        res.render('auth/signin', { csrfToken: req.csrfToken(), 'error': null, 'email': '', 'user': null })
    }
}

module.exports.signup_post = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body

    if(password == confirmPassword) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({ username: username, email: email, password: hashedPassword })
            
            startExpenseCategories.forEach(element => {
                user.expenseCategories.push(element)
            })
            
            startIncomeCategories.forEach(element => {
                user.incomeCategories.push(element)
            })
            
            await user.save()

            const token = createToken(user._id)
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
            
            res.status(201) // success status
            res.redirect('/app/dashboard')
        } catch (error) {
            res.status(400) // error status
            var errorMessages = await signupErrors(username, email, password)
            
            res.render('auth/signup', { csrfToken: req.csrfToken(), errors: errorMessages, email: email, username: username , 'user': null })
        }
    } else {
        var errors = {'confirmPassword': 'Password doesn\'t match'}
        res.status(400)
        res.render('auth/signup', { csrfToken: req.csrfToken(), errors: errors, email: email, username: username, 'user': null })
    }
}

module.exports.signin_post = async (req, res) => {
    const { email, password } = req.body
    
    try {
        const user = await User.findOne({ email: email })
        console.log(user)
        if(user) {
            const auth = bcrypt.compare(password, user.password)
            if(auth) {
                console.log('Auth sucessfull')
                const token = createToken(user._id)
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

                res.status(200)
                return res.redirect('/app/dashboard')
            } else {
                console.log('Wrong username or password (probably password)')
                res.render('auth/signin', { csrfToken: req.csrfToken(), error, 'email': email })
            }
        }
    } catch (error) {
        res.status(400)
        res.render('auth/signin', { csrfToken: req.csrfToken(), error, 'email': email })
    }
}

module.exports.signout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}