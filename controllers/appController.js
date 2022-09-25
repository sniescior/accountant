const User = require("../models/User");

module.exports.dashboard_get = (req, res) => {
    res.render('app/dashboard')
}

module.exports.settings_get = async (req, res) => {
    console.log('Settings get')
    res.render('app/settings')
}