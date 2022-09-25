const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const csurf = require('csurf')
const bodyParser = require('body-parser')
const { checkUser } = require('../middleware/authMiddleware')

const csrfProtection = csurf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false })

router.get('/signup', checkUser, csrfProtection, authController.signup_get)
router.get('/signin', checkUser, csrfProtection, authController.signin_get)
router.post('/signin', checkUser, parseForm, csrfProtection, authController.signin_post)
router.post('/signup', checkUser, parseForm, csrfProtection, authController.signup_post)
router.get('/signout', checkUser, authController.signout_get)

module.exports = router