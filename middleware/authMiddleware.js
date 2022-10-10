const checkUser = (req, res, next) => {
    if(!req.user) {
        res.redirect('/auth/login')
        next()
    } else {
        next()
    }
}

module.exports = checkUser