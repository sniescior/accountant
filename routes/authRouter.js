const express = require('express')
const passport = require('passport')
const User = require('../models/User')
const router = express.Router()
const genPassword = require('../lib/passwordUtils').genPassword

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.get('/signup', (req, res) => {
    res.render('auth/signup', { error: null, email: null, username: null })
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/app/dashboard',
    failureMessage: 'Incorrect username or password'
}))

router.post('/signup', async (req, res) => {
    const emailCheck = await User.findOne({ email: req.body.email })
    const usernameCheck = await User.findOne({ username: req.body.username })

    if(emailCheck && usernameCheck) {
        return res.render('auth/signup', { error: 'username-email', email: req.body.email, username: req.body.username })
    }

    if(emailCheck) {
        return res.render('auth/signup', { error: 'email', email: req.body.email, username: req.body.username })
    }
    
    if(usernameCheck) {
        return res.render('auth/signup', { error: 'username', email: req.body.email, username: req.body.username })
    }

    const saltHash = genPassword(req.body.password)

    const salt = saltHash.salt
    const hash = saltHash.hash

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: {
            passwordHash: hash,
            salt: salt
        }
    })

    await newUser.save()
        .then((user) => {
            res.redirect('/auth/login')
        }).catch((err) => {
            console.log(err)
            res.status(500)
            res.redirect('/500')
        })
})

module.exports = router