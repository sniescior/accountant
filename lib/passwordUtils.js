const crypto = require('crypto')

const genPassword = (password) => {
    var salt = crypto.randomBytes(32).toString('hex')
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    
    return {
        passwordHash: genHash,
        salt: salt
    }
}

const validatePassword = (password, hash, salt) => {
    console.log('Password: ', password)
    console.log('Hash ', hash)
    console.log('Salt ', salt)
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    console.log(hashVerify, hash)
    return hash === hashVerify
}

module.exports.genPassword = genPassword
module.exports.validatePassword = validatePassword