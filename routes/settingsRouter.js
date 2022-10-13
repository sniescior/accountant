const express = require('express')
const router = express.Router()
const incomeCategory = require('../models/incomeCategory')
const expenseCategory = require('../models/expenseCategory')
const accountGroup = require('../models/accountGroup')
const Account = require('../models/Account')
const User = require('../models/User')
const { default: mongoose } = require('mongoose')

const ownershipCheck = (userRefID, currentUserID) => {
    if(userRefID == currentUserID) {
        return true
    } else {
        return false
    }
}

router.get('/*', async (req, res) => {
    
    try {
        const userID = mongoose.Types.ObjectId(req.user.id)
        const incomeCategories = await incomeCategory.find({ userID: userID })
        const expenseCategories = await expenseCategory.find({ userID: userID })
        const accountGroups = await accountGroup.find({ userID: userID })
        
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
            accountGroups: accountGroups
        }
        
        res.render('app/settings', { user: req.user, context: context })
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
        
        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
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
        
        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
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

        res.redirect('/app/settings')
    } catch (error) {
        res.redirect('/app/settings')
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
        res.redirect('/app/settings')
    } catch (error) {
        res.redirect('/app/settings')
    }
})

router.post('/add/account', async (req, res) => {
    const body = req.body

    try {
        const newAccount = new Account({
            userID: req.user.id,
            name: body.newAccountName,
            amount: body.amount
        })

        await newAccount.save()
        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
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

        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
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

        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
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

        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
    }
})

router.post('/edit/username', async (req, res) => {
    const body = req.body

    try {
        const newUsername = body.newUsername
        const userCheck = await User.findOne({ username: newUsername })
        
        if(!userCheck) {
            const currentUser = await User.findById(req.user.id)
            console.log(currentUser);
            currentUser.username = newUsername

            req.user.username = newUsername

            await currentUser.save()
        }

        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
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

        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
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

        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
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
        
        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
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

        res.redirect('app/settings')
    } catch(error) {
        res.redirect('app/settings')
    }
})

module.exports = router