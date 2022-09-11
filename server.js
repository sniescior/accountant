const express = require('express')
const app = express()
const path = require('path')
const authenticationRouter = require('./routes/authRouter')
const appRouter = require('./routes/appRouter')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { checkUser } = require('./middleware/authMiddleware')

// view engine
app.set('view engine', 'ejs')

// middleware
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cookieParser())

// database connection
mongoose
    .connect('mongodb://localhost:27017/accountant', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err))

app.get('*', checkUser)
app.get('/', (req, res) => {
    if(checkUser) {
        res.redirect('/app/dashboard')
    } else {
        res.render('index')
    }
})

app.use('/app', appRouter)
app.use('/auth', authenticationRouter)

var listener = app.listen(3000, (e) => {
    console.log(`App is listening on port ${listener.address().port}`);
})

