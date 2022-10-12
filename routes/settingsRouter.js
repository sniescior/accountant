const express = require('express')
const router = express.Router()
const incomeCategory = require('../models/incomeCategory')
const expenseCategory = require('../models/expenseCategory')
const User = require('../models/User')
const { default: mongoose } = require('mongoose')

router.get('/', async (req, res) => {
    
    try {
        const userID = mongoose.Types.ObjectId(req.user.id)
        const incomeCategories = await incomeCategory.find({ userID: userID })
        const expenseCategories = await expenseCategory.find({ userID: userID })
        
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
            budgetSetCategories: budgetSetCategories
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
        const categoryName = req.body.categoryName
        const budgetAmount = req.body.budgetAmount

        const expenseCategoryToUpdate = await expenseCategory.findOne({ name: categoryName })

        if(expenseCategoryToUpdate.userID == req.user.id) {
            console.log(expenseCategoryToUpdate)
            expenseCategoryToUpdate.budget = budgetAmount
            await expenseCategoryToUpdate.save()
        }

        res.redirect('/app/settings')
    } catch (error) {
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

        const expenseCategoryToUpdate = await expenseCategory.findById(categoryID)
        
        if(expenseCategoryToUpdate.userID == req.user.id) {
            expenseCategoryToUpdate.name = categoryNewName
            await expenseCategoryToUpdate.save()
        }

        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
    }
})

router.post('/edit/income-category', async (req, res) => {
    const body = req.body
    
    const categoryID = body.categoryID
    const categoryNewName = body.categoryNewName
    
    try {
        const incomeCategoryToUpdate = await incomeCategory.findById(categoryID)

        if(incomeCategoryToUpdate.userID == req.user.id) {
            incomeCategoryToUpdate.name = categoryNewName
            await incomeCategoryToUpdate.save()
        }

        res.redirect('/app/settings')        
    } catch(error) {
        res.redirect('/app/settings')
    }
})

router.post('/edit/username', async (req, res) => {
    const body = req.body

    const newUsername = body.newUsername

    console.log(newUsername);

    try {
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

/**
 * ------------- DELETE Routes -------------
 */

router.post('/delete/income-category', async (req, res) => {
    const body = req.body

    try {
        const incomeCategoryToDelete = await incomeCategory.findById(body.categoryID)

        if(incomeCategoryToDelete.userID == req.user.id) {
            await incomeCategory.findByIdAndDelete(body.categoryID)
        }

        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
    }
})

router.post('/delete/expense-category', async (req, res) => {
    const body = req.body

    try {
        const expenseCategoryToDelete = await expenseCategory.findById(body.categoryID)

        if(expenseCategoryToDelete.userID == req.user.id) {
            await expenseCategory.findByIdAndDelete(body.categoryID)
        }
        
        res.redirect('/app/settings')
    } catch(error) {
        res.redirect('/app/settings')
    }
})

module.exports = router