const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const User = require('../models/User')

router.get('/dashboard', requireAuth, appController.dashboard_get)

router.post('/settings/income-cat-add', requireAuth, checkUser, async (req, res) => {
    const { incomeCatName } = req.body
    let user = res.locals.user
    user.incomeCategories.push({ 'name': incomeCatName })
    await user.save()
    res.redirect('/app/settings/configuration')
})

router.post('/settings/expense-cat-add', requireAuth, checkUser, async (req, res) => {
    const { expenseCatName } = req.body
    let user = res.locals.user
    user.expenseCategories.push({ 'name': expenseCatName })
    await user.save()
    res.redirect('/app/settings/configuration')
})

router.post('/settings/expense-cat-delete', requireAuth, checkUser, async (req, res) => {
    const { expenseCatID } = req.body
    let user = res.locals.user
    user.expenseCategories.pull({_id: expenseCatID})
    await user.save()
    res.redirect('/app/settings/configuration')
})

router.post('/settings/income-cat-delete', requireAuth, checkUser, async (req, res) => {
    const { incomeCatID } = req.body
    let user = res.locals.user
    user.incomeCategories.pull({_id: incomeCatID})
    await user.save()
    res.redirect('/app/settings/configuration')
})

router.post('/settings/budget-delete', requireAuth, checkUser, async (req, res) => {
    const { budgetCatID } = req.body
    let user = res.locals.user
    console.log(budgetCatID)
    Array.from(user.expenseCategories).forEach(element => {
        if(element.id == budgetCatID) {
            element.budget = null
            return
        }
    })
    await user.save()
    res.redirect('/app/settings/configuration')
})

router.post('/settings/budget-add', requireAuth, checkUser, async (req, res) => {
    const { budgetAddCategory, budgetAddValue } = req.body
    console.log(budgetAddCategory, budgetAddValue)
    const user = res.locals.user
    const expenseCategories = await user.expenseCategories
    Array.from(expenseCategories).forEach(element => {
        if(element.name == budgetAddCategory) {
            element.budget = budgetAddValue
            return
        }
    })
    await user.save()
    res.redirect('/app/settings/configuration')
})

router.get('/settings*', requireAuth, appController.settings_get)

module.exports = router