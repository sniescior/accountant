const express = require('express')
const app = express()
const path = require('path')
const authenticationRouter = require('./routes/authentication')

app.set('view engine', 'ejs')

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index')
})

app.use('/auth', authenticationRouter)

var listener = app.listen(3000, (e) => {
    console.log(`App is listening on port ${listener.address().port}`);
})
