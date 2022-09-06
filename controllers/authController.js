const User = require('../models/User')

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
        console.log(error);
        res.status(400) // error
        res.send('Error. User not created')
    }
}

module.exports.signin_post = async (req, res) => {
    const { username, email, password } = req.body
    
    try {
        
    } catch (error) {

    }

    res.send('user login')
}