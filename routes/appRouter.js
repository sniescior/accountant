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

router.post('/settings/group-add', requireAuth, checkUser, async (req, res) => {
    const { groupNameValue } = req.body
    const user = res.locals.user
    user.accountGroups.push({ 'groupName': groupNameValue })
    await user.save()
    res.redirect('/app/settings/accounts')
})

router.post('/settings/acc-group-delete', requireAuth, checkUser, async (req, res) => {
    const { groupNameID } = req.body
    const user = res.locals.user
    user.accountGroups.pull({ '_id': groupNameID })
    await user.save()
    res.redirect('/app/settings/accounts')
})

router.post('/settings/acc-add', requireAuth, checkUser, async (req, res) => {
    const { accAddName, accAddValue, accAddGroup } = req.body
    const user = res.locals.user

    Array.from(user.accountGroups).forEach(group => {
        if(group.groupName == accAddGroup) {
            group.accounts.push({ 'name': accAddName, 'amount': accAddValue })
            return
        }
    })

    await user.save()
    res.redirect('/app/settings/accounts')
})

router.post('/settings/acc-delete', requireAuth, checkUser, async (req, res) => {
    const { accountID, accountGroupID } = req.body
    const user = res.locals.user
    console.log(accountID, accountGroupID)

    // Array.from(user.accountGroups).forEach(group => {
    //     if(accountGroupID == group._id) {
    //         group.accounts.pull({ '_id': accountID })
    //         return
    //     }
    // })

    // await user.save()
    res.redirect('/app/settings/accounts')
})

router.post('/settings/acc-update', requireAuth, checkUser, async (req, res) => {
    const { accID, accEditGroup, accEditName, accEditValue } = req.body
    const user = res.locals.user
    console.log(accID, accEditGroup, accEditName, accEditValue);
    let updatedAccount = {
        'name': accEditName,
        'amount': accEditValue
    }
    
    Array.from(user.accountGroups).forEach(group => {
        Array.from(group.accounts).forEach(account => {
            if(account.id == accID) {
                group.accounts.pull({_id: account.id})
                return
            }
        })
    })
    Array.from(user.accountGroups).forEach(group => {
        if(group.groupName == accEditGroup) {
            group.accounts.push({ 'name': updatedAccount.name, 'amount': updatedAccount.amount })
            return
        }
    })
    
    await user.save()

    res.redirect('/app/settings/accounts')
})

router.get('/settings*', requireAuth, appController.settings_get)

module.exports = router