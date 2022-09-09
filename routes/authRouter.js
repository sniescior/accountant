const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const csurf = require('csurf')
const bodyParser = require('body-parser')

const csrfProtection = csurf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false })

router.get('/signup', csrfProtection, authController.signup_get)
router.get('/signin', csrfProtection, authController.signin_get)
router.post('/signin', parseForm, csrfProtection, authController.signin_post)
router.post('/signup', parseForm, csrfProtection, authController.signup_post)
router.post('/signout', authController.signout_get)

module.exports = router