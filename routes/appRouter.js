const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const User = require('../models/User')

router.get('/dashboard', requireAuth, appController.dashboard_get)

module.exports = router