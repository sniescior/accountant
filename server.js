const express = require('express')
const app = express()
const path = require('path')

app.set('view engine', 'ejs')

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/', (req, res) => {
    res.render('index')
})


var listener = app.listen(3000, (e) => {
    console.log(`App is listening on port ${listener.address().port}`);
})
