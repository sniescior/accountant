const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const csurf = require('csurf')
const bodyParser = require('body-parser')
// const { checkUser } = require('../middleware/authMiddleware')

const csrfProtection = csurf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false })

router.get('/signup', csrfProtection, authController.signup_get)
router.get('/signin', csrfProtection, authController.signin_get)
// router.get('/signout', checkUser, authController.signout_get)

module.exports = router