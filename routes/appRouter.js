const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController')

router.get('/dashboard', appController.dashboard_get)

module.exports = router