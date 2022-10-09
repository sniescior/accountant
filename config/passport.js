const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('../models/User');
const validatePassword = require('../lib/passwordUtils').validatePassword

const fields = {
    usernameField: 'username',
    passwordField: 'password'
}

const verifyCallback = (username, password, done) => {
    User.findOne({ username: username }, function (err, user) {
        if(err) { 
            return done(err)
        }

        if(!user) { 
            return done(null, false)
        }

        if(!validatePassword(password, user.password.passwordHash, user.password.salt)) { 
            return done(null, false)
        }

        return done(null, user)
    });
}

const strategy = new LocalStrategy(fields, verifyCallback)

passport.use(strategy)

passport.serializeUser(function(user, done) {
    process.nextTick(function() {
      done(null, { id: user.id, username: user.username });
    });
});
  
passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, user);
    });
});