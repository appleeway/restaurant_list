//require packages used in the project 
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
//載入Passport config
require('./config/passport')(passport)

//constant value
const app = express()
const port = 3000

//setting mongodb
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
//連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
//連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})
//setting method_override
app.use(methodOverride('_method'))

//setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//setting express-handlebars here
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//setting sesssion
app.use(session({
  secret: 'hot cat',
  resave: false,
  saveUninitialized: true
}))

//using Passport
app.use(passport.initialize())
app.use(passport.session())


//登入後可以取得使用者的資訊方便我們在view裡面使用
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})


//setting routes
app.use('/', require('./routes/home'))
app.use('/restaurants', require('./routes/restaurant'))
app.use('/users', require('./routes/user'))

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
