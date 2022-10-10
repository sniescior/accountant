const express = require('express')
const settingsRouter = require('./settingsRouter')
const router = express.Router()

router.get('/dashboard', (req, res) => {
    res.render('app/dashboard', { user: req.user })
})

router.use('/settings', settingsRouter)

module.exports = router

