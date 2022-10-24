const express = require('express')
const checkUser = require('../middleware/authMiddleware')
const authRouter = require('./authRouter')
const router = express.Router()
const dashboardRouter = require('./dashboardRouter')
const settingsRouter = require('./settingsRouter')

router.get('/500', (req, res) => {
    res.render('errors/500')
})

router.use('/app/dashboard', checkUser, dashboardRouter)
router.use('/app/settings', checkUser, settingsRouter)

router.use('/auth', authRouter)

module.exports = router