const express = require('express')
const router = express.Router()
const incomeCategory = require('../models/incomeCategory')
const expenseCategory = require('../models/expenseCategory')
const { default: mongoose } = require('mongoose')

router.get('/', async (req, res) => {
    
    const userID = mongoose.Types.ObjectId(req.user.id)
    const incomeCategories = await incomeCategory.find({ userID: userID })
    const expenseCategories = await expenseCategory.find({ userID: userID })

    const context = {
        incomeCategories: incomeCategories,
        expenseCategories: expenseCategories
    }

    res.render('app/settings', { user: req.user, context: context })
})

/**
 * ------------- ADD Routes -------------
 */

router.post('/add/income-category', async (req, res) => {
    const body = req.body

    const newIncomeCategory = new incomeCategory({
        userID: req.user.id,
        name: body.categoryName
    })

    await newIncomeCategory.save()
    
    res.redirect('/app/settings')
})

router.post('/add/expense-category', async (req, res) => {
    const body = req.body

    const newExpenseCategory = new expenseCategory({
        userID: req.user.id,
        name: body.categoryName
    })

    await newExpenseCategory.save()
    
    res.redirect('/app/settings')
})

/**
 * ------------- EDIT Routes -------------
 */

router.post('/edit/income-category', async (req, res) => {
    const body = req.body
    
    const categoryID = body.categoryID
    const categoryNewName = body.categoryNewName
    
    const incomeCategoryToUpdate = await incomeCategory.findByIdAndUpdate({ _id: categoryID }, { name: categoryNewName })

    res.redirect('/app/settings')
})

router.post('/edit/income-category', async (req, res) => {
    const body = req.body
    
    const categoryID = body.categoryID
    const categoryNewName = body.categoryNewName
    
    // const incomeCategoryToUpdate = await incomeCategory.findByIdAndUpdate({ _id: categoryID }, { name: categoryNewName })
    const incomeCategoryToUpdate = incomeCategory.findById(categoryID)

    if(incomeCategoryToUpdate.userID == req.user.id) {   
        incomeCategoryToUpdate.name = categoryNewName
        await incomeCategoryToUpdate.save()
    }

    // TODO: Check whether found category belongs to the logged in user (just like in case of deleting categories)

    res.redirect('/app/settings')
})

/**
 * ------------- DELETE Routes -------------
 */

router.post('/delete/income-category', async (req, res) => {
    const body = req.body

    // await incomeCategory.findByIdAndDelete(body.categoryID)

    const incomeCategoryToDelete = await incomeCategory.findById(body.categoryID)
    if(incomeCategoryToDelete.userID == req.user.id) {
        await incomeCategory.findByIdAndDelete(body.categoryID)
    }
    
    res.redirect('/app/settings')
})

router.post('/delete/expense-category', async (req, res) => {
    const body = req.body

    const expenseCategoryToDelete = await expenseCategory.findById(body.categoryID)
    if(expenseCategoryToDelete.userID == req.user.id) {
        await expenseCategory.findByIdAndDelete(body.categoryID)
    }
    
    res.redirect('/app/settings')
})

module.exports = router