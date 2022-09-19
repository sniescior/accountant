const bodyParser = require('body-parser')
const express = require('express')
const router = express.Router()
const appController = require('../controllers/appController')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const User = require('../models/User')

router.get('/dashboard', requireAuth, appController.dashboard_get)

router.post('/settings/income-cat-add', requireAuth, checkUser, async (req, res) => {
    const { incomeCatName } = req.body
    let user = await res.locals.user
    user.incomeCategories.push({ 'name': incomeCatName })
    await user.save()
    res.redirect('/app/settings/configuration')
})

router.post('/settings/expense-cat-add', requireAuth, checkUser, async (req, res) => {
    const { expenseCatName } = req.body
    let user = await res.locals.user
    user.expenseCategories.push({ 'name': expenseCatName })
    await user.save()
    res.redirect('/app/settings/configuration')
})

router.post('/settings/expense-cat-delete', requireAuth, checkUser, async (req, res) => {
    const { expenseCatID } = req.body
    let user = await res.locals.user
    user.expenseCategories.pull({_id: expenseCatID})
    await user.save()
    res.redirect('/app/settings/configuration')
})

router.post('/settings/income-cat-delete', requireAuth, checkUser, async (req, res) => {
    const { incomeCatID } = req.body
    let user = await res.locals.user
    user.incomeCategories.pull({_id: incomeCatID})
    await user.save()
    res.redirect('/app/settings/configuration')
})

router.get('/settings*', requireAuth, appController.settings_get)

module.exports = router