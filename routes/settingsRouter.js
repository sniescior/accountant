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

    // const newIncomeCategory = new incomeCategory({
    //     userID: req.user.id,
    //     name: 'New Income Category'
    // })

    // await newIncomeCategory.save()

    res.render('app/settings', { user: req.user, context: context })
})

module.exports = router