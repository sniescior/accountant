const express = require('express')
const checkUser = require('../middleware/authMiddleware')
const authRouter = require('./authRouter')
const router = express.Router()
const dashboardRouter = require('./dashboardRouter')

router.get('/500', (req, res) => {
    res.render('errors/500')
})

router.use('/app', checkUser, dashboardRouter)

router.use('/auth', authRouter)

module.exports = router