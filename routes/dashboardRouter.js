const express = require('express')
const expenseTransaction = require('../models/expenseTransaction')
const incomeTransaction = require('../models/incomeTransaction')
const incomeCategory = require('../models/incomeCategory')
const expenseCategory = require('../models/expenseCategory')
const accountGroup = require('../models/accountGroup')
const Account = require('../models/Account')
const User = require('../models/User')
const mongoose = require('mongoose')
const settingsRouter = require('./settingsRouter')
const router = express.Router()

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

router.get('/', async (req, res) => {
    try {
        const { context, currentUser } = await getContext(req, res)

        res.render('app/dashboard', { user: currentUser, context: context })
    } catch {
        res.redirect('/404')
    }
})

/**
 * ------------- ADD Routes -------------
 */

router.post('/add/income-transaction', async (req, res) => {
    const body = req.body

    try {

        const accountRef = await Account.findOne({ userID: req.user.id, name: body.accountName })
        const incomeCategoryRef = await incomeCategory.findOne({ userID: req.user.id, name: body.incomeCategoryName })

        const newIncomeTransaction = new incomeTransaction({
            userID: req.user.id,
            accountID: accountRef.id,
            incomeCategoryID: incomeCategoryRef.id,
            title: body.title,
            amount: body.amount,
            note: body.note,
            date: Date.now()
        })

        console.log(newIncomeTransaction)

        await newIncomeTransaction.save()

        res.redirect('/app/dashboard')
    } catch(error) {
        res.redirect('/app/dashboard')
    }
})

router.post('/add/expense-transaction', async (req, res) => {
    const body = req.body

    try {
        const accountRef = await Account.findOne({ name: body.accountName })
        const expenseCategoryRef = await expenseCategory.findOne({ name: body.expenseCategoryName })

        console.log(accountRef);
        console.log(expenseCategoryRef);

        const newExpenseTransaction = new expenseTransaction({
            userID: req.user.id,
            accountID: accountRef.id,
            expenseCategoryID: expenseCategoryRef.id,
            title: body.title,
            amount: body.amount,
            note: body.note,
            date: Date.now()
        })

        await newExpenseTransaction.save()

        res.redirect('/app/dashboard')
    } catch(error) {
        res.redirect('/app/dashboard')
    }
})

router.use('/settings', settingsRouter)

module.exports = router

