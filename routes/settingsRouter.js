const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('app/settings', { user: req.user })
})

module.exports = router