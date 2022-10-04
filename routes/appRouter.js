const express = require('express')
const authRouter = require('./authRouter')
const router = express.Router()

router.get('/500', (req, res) => {
    res.render('errors/500')
})

router.use('/auth', authRouter)

module.exports = router