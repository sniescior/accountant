const express = require('express')
const passport = require('passport')
const starterData = require('../models/starterData')
const incomeCategory = require('../models/incomeCategory')
const expenseCategory = require('../models/expenseCategory')
const accountGroup = require('../models/accountGroup')
const Account = require('../models/Account')
const User = require('../models/User')
const router = express.Router()
const genPassword = require('../lib/passwordUtils').genPassword

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.get('/signup', (req, res) => {
    res.render('auth/signup', { error: null, email: null, username: null })
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/app/dashboard',
    failureMessage: 'Incorrect username or password'
}))

router.post('/signup', async (req, res) => {
    const emailCheck = await User.findOne({ email: req.body.email })
    const usernameCheck = await User.findOne({ username: req.body.username })

    if(emailCheck && usernameCheck) {
        return res.render('auth/signup', { error: 'username-email', email: req.body.email, username: req.body.username })
    }

    if(emailCheck) {
        return res.render('auth/signup', { error: 'email', email: req.body.email, username: req.body.username })
    }
    
    if(usernameCheck) {
        return res.render('auth/signup', { error: 'username', email: req.body.email, username: req.body.username })
    }

    const saltHash = genPassword(req.body.password)

    const salt = saltHash.salt
    const hash = saltHash.passwordHash

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: {
            passwordHash: hash,
            salt: salt
        }
    })

    /**
    * ------------- DEFAULT DATA SETUP -------------
    */

    const starterObject = await starterData.findById(process.env.DB_STARTER_DATA_OBJECT_ID)

    // Income categories
    Array.from(starterObject.incomecategories).forEach(async category => {
        const newIncomeCategory = new incomeCategory({
            userID: newUser.id,
            name: category.name
        })

        await newIncomeCategory.save()
    })

    // Expense categories
    Array.from(starterObject.expensecategories).forEach(async category => {
        const newExpenseCategory = new expenseCategory({
            userID: newUser.id,
            name: category.name
        })

        await newExpenseCategory.save()
    })

    // Account groups
    Array.from(starterObject.accountgroups).forEach(async accountgroup => {
        const newAccountGroup = new accountGroup({
            userID: newUser.id,
            groupName: accountgroup.name
        })

        await newAccountGroup.save()

        Array.from(accountgroup.accounts).forEach(async account => {
            const newAccount = Account({
                userID: newUser.id,
                name: account.name,
                amount: account.amount
            })

            await newAccount.save()

            newAccountGroup.accounts.push({ accountID: newAccount.id })

            await newAccountGroup.save()
        })
    })

    await newUser.save()
        .then((user) => {
            res.redirect('/auth/login')
        }).catch((err) => {
            console.log(err)
            res.status(500)
            res.redirect('/500')
        })
})

module.exports = router