const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController')
const { requireAuth } = require('../middleware/authMiddleware')

router.get('/dashboard', requireAuth, appController.dashboard_get)
router.get('/settings', requireAuth, appController.settings_get)

module.exports = router