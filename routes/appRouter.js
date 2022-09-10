const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController')
const { requireAuth } = require('../middleware/authMiddleware')

router.get('/dashboard', requireAuth, appController.dashboard_get)

module.exports = router