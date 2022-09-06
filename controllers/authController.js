const User = require('../models/User')

const handleErrors = (error) => {
    console.log(error.message, error.code)
    let error_messages = { 'username': '', 'email': '', 'password': ''}

    // duplicate found error
    if(error.code == 11000) {
        error_messages['email'] = 'Email or username already registered'
        return error_messages
    }
    
    // validation errors
    if(error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach(({properties}) => {
            // console.log(properties)
            // console.log(element.message + ' ' + element.path)
            error_messages[properties.path] = properties.message
        });
    }

    return error_messages
}

module.exports.signup_get = (req, res) => {
    res.render('auth/signup')
}

module.exports.signin_get = (req, res) => {
    res.render('auth/signin')
}

module.exports.signup_post = async (req, res) => {
    const { username, email, password } = req.body

    try {
        const user = await User.create({ username, email, password })
        res.status(201).json(user) // success status
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({ errors })
    }
}

module.exports.signin_post = async (req, res) => {
    const { username, email, password } = req.body
    
    try {

    } catch (error) {

    }

    res.send('user login')
}