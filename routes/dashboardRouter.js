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

const getCurrentTime = () => {
    var currentDate = new Date()
    const timeStamp = new Date(Date.UTC(currentDate.getFullYear(), 
    currentDate.getMonth(),currentDate.getDate(),currentDate.getHours(), 
    currentDate.getMinutes(),currentDate.getSeconds(), currentDate.getMilliseconds()))

    return timeStamp
}

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

router.post('/getTransactions', async (req, res) => {
    let payload = req.body.payload
    let year = payload.year
    let month = payload.month
    let date = payload.date

    const startDate = new Date(Date.UTC(year, month, date, 0, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, month, date, 23, 59, 59, 999))

    const incomeTransactions = await incomeTransaction.find({
        userID: req.user.id,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }, { _id: 0, userID: 0 })

    const expenseTransactions = await expenseTransaction.find({
        userID: req.user.id,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }, { _id: 0, userID: 0 })

    let transactions = []
    let promises = []

    incomeTransactions.forEach(transaction => {
        promises.push(
            new Promise((resolve, reject) => {
                let account = Account.findById(transaction.accountID).exec()
                account.then((accountDoc) => {
                    let category = incomeCategory.findById(transaction.incomeCategoryID).exec()
                    category.then((categoryDoc) => {
                        transactions.push({
                            type: 'inc',    // inc -> income transaction
                            accountName: accountDoc.name,
                            title: transaction.title,
                            note: transaction.note,
                            amount: transaction.amount,
                            category: categoryDoc.name
                        })

                        resolve()
                    })
                })
            })
        )
    })

    expenseTransactions.forEach(transaction => {
        promises.push(
            new Promise((resolve, reject) => {
                let account = Account.findById(transaction.accountID).exec()
                account.then((accountDoc) => {
                    let category = expenseCategory.findById(transaction.expenseCategoryID).exec()
                    category.then((categoryDoc) => {
                        transactions.push({
                            type: 'exp',    // exp -> expense transaction
                            accountName: accountDoc.name,
                            title: transaction.title,
                            note: transaction.note,
                            amount: transaction.amount,
                            category: categoryDoc.name
                        })

                        resolve()
                    })
                })
            })
        )
    })

    Promise.all(promises).then(() => {
        console.log(transactions)
        console.log('All done')
        res.send({ transactions: transactions })
    })
})

router.get('/', async (req, res) => {
    try {
        const { context, currentUser } = await getContext(req, res)
        
        res.render('app/dashboard', { user: currentUser, context: context })
    } catch(error) {
        console.log(error)
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

        const timeStamp = getCurrentTime()

        const newIncomeTransaction = new incomeTransaction({
            userID: req.user.id,
            accountID: accountRef.id,
            incomeCategoryID: incomeCategoryRef.id,
            title: body.title,
            amount: body.amount,
            note: body.note,
            date: timeStamp
        })

        console.log(newIncomeTransaction)

        await newIncomeTransaction.save()

        res.redirect('/app/dashboard')
    } catch(error) {
        console.log(error)
        res.redirect('/app/dashboard')
    }
})

router.post('/add/expense-transaction', async (req, res) => {
    const body = req.body

    try {
        const accountRef = await Account.findOne({ name: body.accountName })
        const expenseCategoryRef = await expenseCategory.findOne({ name: body.expenseCategoryName })

        const timeStamp = getCurrentTime()

        const newExpenseTransaction = new expenseTransaction({
            userID: req.user.id,
            accountID: accountRef.id,
            expenseCategoryID: expenseCategoryRef.id,
            title: body.title,
            amount: body.amount,
            note: body.note,
            date: timeStamp
        })

        await newExpenseTransaction.save()

        res.redirect('/app/dashboard')
    } catch(error) {
        res.redirect('/app/dashboard')
    }
})

router.use('/settings', settingsRouter)

module.exports = router

