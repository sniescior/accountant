const express = require('express')
const router = express.Router()

module.exports.signup_get =  (req, res) => {
    res.render('auth/signup')
}

module.exports.signin_get =  (req, res) => {
    res.render('auth/signin')
}
