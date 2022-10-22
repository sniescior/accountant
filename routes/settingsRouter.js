const express = require('express')
const router = express.Router()
const incomeCategory = require('../models/incomeCategory')
const expenseCategory = require('../models/expenseCategory')
const accountGroup = require('../models/accountGroup')
const Account = require('../models/Account')
const User = require('../models/User')
const { default: mongoose } = require('mongoose')
const validatePassword = require('../lib/passwordUtils').validatePassword
const genPassword = require('../lib/passwordUtils').genPassword

router.get('/', (req, res) => {
    res.redirect('/app/settings/profile')
})

const getContext = async (req, res) => {
    const userID = mongoose.Types.ObjectId(req.user.id)
    const incomeCategories = await incomeCategory.find({ userID: userID })
    const expenseCategories = await expenseCategory.find({ userID: userID })
    const accountGroups = await accountGroup.find({ userID: userID })
    const accounts = await Account.find({ userID: req.user.id })
    
    // Categories that have a set budget
    const budgetSetCategories = []
    expenseCategories.forEach(expenseCategory => {
        if(expenseCategory.budget != null) {
            budgetSetCategories.push(expenseCategory)
        }
    })
    
    const context = {
        incomeCategories: incomeCategories,
        expenseCategories: expenseCategories,
        budgetSetCategories: budgetSetCategories,
        accountGroups: accountGroups,
        accounts: accounts
    }

    const currentUser = await User.findById(req.user.id)

    return {
        context, currentUser
    }
}

router.get('/profile', async (req, res) => {
    try {
        const { context, currentUser } = await getContext(req, res)
        
        res.render('app/settings', { user: currentUser, context: context })
    } catch(error) {
        res.redirect('/404')
    }
})

router.get('/configuration', async (req, res) => {
    try {
        const { context, currentUser } = await getContext(req, res)
        
        res.render('app/settings', { user: currentUser, context: context })
    } catch(error) {
        res.redirect('/404')
    }
})

router.get('/configuration/income-categories', async (req, res) => {
    try {
        const { context, currentUser } = await getContext(req, res)
        
        res.render('app/settings', { user: currentUser, context: context })
    } catch(error) {
        res.redirect('/404')
    }
})

router.get('/configuration/expense-categories', async (req, res) => {
    try {
        const { context, currentUser } = await getContext(req, res)
        
        res.render('app/settings', { user: currentUser, context: context })
    } catch(error) {
        res.redirect('/404')
    }
})

router.get('/configuration/budget', async (req, res) => {
    try {
        const { context, currentUser } = await getContext(req, res)
        
        res.render('app/settings', { user: currentUser, context: context })
    } catch(error) {
        res.redirect('/404')
    }
})

router.get('/accounts/groups', async (req, res) => {
    try {
        const { context, currentUser } = await getContext(req, res)
        
        res.render('app/settings', { user: currentUser, context: context })
    } catch(error) {
        res.redirect('/404')
    }
})

router.get('/accounts/accounts-configuration', async (req, res) => {
    try {
        const { context, currentUser } = await getContext(req, res)
        
        res.render('app/settings', { user: currentUser, context: context })
    } catch(error) {
        res.redirect('/404')
    }
})

/**
 * ------------- ADD Routes -------------
 */

router.post('/add/income-category', async (req, res) => {
    const body = req.body

    try {
        const newIncomeCategory = new incomeCategory({
            userID: req.user.id,
            name: body.categoryName
        })
        
        await newIncomeCategory.save()
        
        res.redirect('/app/settings/configuration/income-categories')
    } catch(error) {
        res.redirect('/app/settings/configuration/income-categories')
    }
})

router.post('/add/expense-category', async (req, res) => {
    const body = req.body

    try {
        const newExpenseCategory = new expenseCategory({
            userID: req.user.id,
            name: body.categoryName
        })
        
        await newExpenseCategory.save()
        
        res.redirect('/app/settings/configuration/expense-categories')
    } catch(error) {
        res.redirect('/app/settings/configuration/expense-categories')
    }
})

router.post('/add/budget', async (req, res) => {
    const body = req.body

    try {
        const categoryName = body.categoryName
        const budgetAmount = body.budgetAmount

        await expenseCategory.findOneAndUpdate({ 
            name: categoryName,
            userID: req.user.id
        }, {
            budget: budgetAmount
        })

        res.redirect('/app/settings/configuration/budget')
    } catch (error) {
        res.redirect('/app/settings/configuration/budget')
    }
})

router.post('/add/account-group', async (req, res) => {
    const body = req.body

    try {
        const newGroupName = body.groupName
        const newAccountGroup = new accountGroup({
            userID: req.user.id,
            groupName: newGroupName
        })

        await newAccountGroup.save()
        res.redirect('/app/settings/accounts/groups')
    } catch (error) {
        res.redirect('/app/settings/accounts/groups')
    }
})

router.post('/add/account', async (req, res) => {
    const body = req.body

    console.log('Adding account')
    console.log(body)

    try {
        console.log('Adding account try succeeded')
        const newAccount = new Account({
            userID: req.user.id,
            name: body.newAccountName,
            amount: body.newAccountBalance
        })

        const selectedAccountGroup = await accountGroup.findOne({
            userID: req.user.id,
            groupName: body.accountGroupName
        })

        await newAccount.save()

        selectedAccountGroup.accounts.push({
            accountID: newAccount._id
        })
        
        console.log('New Account created: ', newAccount)
        console.log('New Group created', selectedAccountGroup)

        await selectedAccountGroup.save()

        res.redirect('/app/settings/accounts/accounts-configuration')
    } catch(error) {
        res.redirect('/app/settings/accounts/accounts-configuration')
    }
})

/**
 * ------------- EDIT Routes -------------
 */

router.post('/edit/expense-category', async (req, res) => {
    const body = req.body
    
    try {
        const categoryID = body.categoryID
        const categoryNewName = body.categoryNewName

        await expenseCategory.findOneAndUpdate({
            _id: categoryID,
            userID: req.user.id,
        }, {
            name: categoryNewName
        })

        res.redirect('/app/settings/configuration/expense-categories')
    } catch(error) {
        res.redirect('/app/settings/configuration/expense-categories')
    }
})

router.post('/edit/income-category', async (req, res) => {
    const body = req.body
    
    try {
        const categoryID = body.categoryID
        const categoryNewName = body.categoryNewName

        await incomeCategory.findOneAndUpdate({
            _id: categoryID,
            userID: req.user.id
        }, {
            name: categoryNewName
        })

        res.redirect('/app/settings/configuration/income-categories')
    } catch(error) {
        res.redirect('/app/settings/configuration/income-categories')
    }
})

router.post('/edit/budget', async (req, res) => {
    const body = req.body

    try {
        const newAmount = body.newBudgetAmount
        const categoryID = body.categoryID

        await expenseCategory.findOneAndUpdate({
            _id: categoryID,
            userID: req.user.id
        }, {
            budget: newAmount
        })

        res.redirect('/app/settings/configuration/budget')
    } catch(error) {
        res.redirect('/app/settings/configuration/budget')
    }
})

router.post('/edit/profile', async (req, res) => {
    const body = req.body

    try {
        const newUsername = body.newUsername
        const currentUser = await User.findById(req.user.id)
        
        // If current users's username is no different than one that's submitted then there is no need for doing anything
        if(newUsername != req.user.username) {
            const userCheckUsername = await User.findOne({ username: newUsername })
            
            if(!userCheckUsername) {
                console.log(currentUser);
                currentUser.username = newUsername
                
                req.user.username = newUsername
                
                await currentUser.save()
            }
        }
        
        const newEmail = body.newEmail
        
        // Same as with username
        if(newEmail != req.user.email) {
            const userCheckEmail = await User.findOne({ email: newEmail })
            
            if(!userCheckEmail) {
                currentUser.email = newEmail
                
                req.user.email = newEmail
                
                await currentUser.save()
            }
        }

        res.redirect('/app/settings/profile')
    } catch(error) {
        res.redirect('/app/settings/profile')
    }
})

router.post('/edit/password', async (req, res) => {
    const body = req.body
    const currentUser = await User.findById(req.user.id)

    try {
        const passwordCheck = validatePassword(body.oldPassword, currentUser.password.passwordHash, currentUser.password.salt)

        if(passwordCheck) {
            currentUser.password = genPassword(body.newPassword)
            await currentUser.save()
        } else {
            // Old password doesn't match
        }

        res.redirect('/app/settings/security')
    } catch(error) {
        res.redirect('/app/settings/security')
    }
})

router.post('/edit/account-group', async (req, res) => {
    const body = req.body

    try {
        const groupID = body.groupID
        const groupNewName = body.groupNewName
        
        await accountGroup.findOneAndUpdate({
            _id: groupID,
            userID: req.user.id
        }, {
            groupName: groupNewName
        })

        res.redirect('/app/settings/accounts/groups')
    } catch(error) {
        res.redirect('/app/settings/accounts/groups')
    }
})

router.post('/edit/account', async (req, res) => {
    const body = req.body

    try {
        const accountID = body.accountID
        const accountNewName = body.accountNewName
        const accountNewBalance = body.accountNewBalance

        await Account.findOneAndUpdate({
            _id: accountID,
            userID: req.user.id,
        }, {
            name: accountNewName, 
            amount: accountNewBalance
        })

        res.redirect('/app/settings/accounts/accounts-configuration')
    } catch(error) {
        res.redirect('/app/settings/accounts/accounts-configuration')
    }
})

/**
 * ------------- DELETE Routes -------------
 */

router.post('/delete/income-category', async (req, res) => {
    const body = req.body

    try {
        const categoryID = body.categoryID

        await incomeCategory.findOneAndDelete({
            _id: categoryID,
            userID: req.user.id
        })

        res.redirect('/app/settings/configuration/income-categories')
    } catch(error) {
        res.redirect('/app/settings/configuration/income-categories')
    }
})

router.post('/delete/expense-category', async (req, res) => {
    const body = req.body

    try {
        const categoryID = body.categoryID

        await expenseCategory.findOneAndDelete({
            _id: categoryID,
            userID: req.user.id
        })
        
        res.redirect('/app/settings/configuration/expense-categories')
    } catch(error) {
        res.redirect('/app/settings/configuration/expense-categories')
    }
})

router.post('/delete/budget', async (req, res) => {
    const body = req.body

    try {
        const categoryID = body.categoryID

        await expenseCategory.findOneAndUpdate({
            _id: categoryID,
            userID: req.user.id
        }, {
            budget: null
        })

        res.redirect('/app/settings/configuration/budget')
    } catch(error) {
        res.redirect('/app/settings/configuration/budget')
    }
})

router.post('/delete/account', async (req, res) => {
    const body = req.body

    try {
        const accountID = body.accountID

        try {
            const accountGroupToUpdate = await accountGroup.findOne({
                accounts: { accountID: mongoose.Types.ObjectId(accountID)}
            })
            accountGroupToUpdate.accounts.pull({ accountID: accountID })
            await accountGroupToUpdate.save()
        } catch(error) {}
        
        await Account.findOneAndDelete({
            _id: accountID,
            userID: req.user.id
        })

        res.redirect('/app/settings/accounts/accounts-configuration')
    } catch(error) {
        res.redirect('/app/settings/accounts/accounts-configuration')
    }
})

router.post('/delete/account-group', async (req, res) => {
    const body = req.body

    try {
        const accountGroupID = body.accountGroupID
        await accountGroup.findOneAndDelete({
            _id: accountGroupID,
            userID: req.user.id
        })

        res.redirect('/app/settings/accounts/groups')
    } catch(error) {
        res.redirect('/app/settings/accounts/groups')
    }
})

module.exports = router