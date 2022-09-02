const express = require('express')
const router = express.Router()

router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.get('/signin', (req, res) => {
    res.render('auth/signin')
})

module.exports = router