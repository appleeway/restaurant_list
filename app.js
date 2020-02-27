//require packages used in the project 
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const restaurantList = require('./restaurant.json')

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

//setting express-handlebars here
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//餐廳首頁
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      res.render('index', { restaurants })
    })
})
//餐廳搜尋
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.includes(keyword) || restaurant.category.includes(keyword) || restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants, keyword })
})
//新增一筆餐廳頁面
app.get('/restaurants/new', (req, res) => {
  res.send('新增餐廳頁面')
})
//新增一筆餐廳資料
app.post('restaurants', (req, res) => {
  res.send('新增餐廳資訊')
})
//顯示所有餐廳資訊
app.get('/restaurants', (req, res) => {
  return res.redirect('/')
})
//顯示特定餐廳詳細資訊
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.id)
  res.render('show', { restaurant })
})
//修改一筆餐廳頁面
app.get('/restaurants/:id/edit', (req, res) => {
  res.send('修改餐廳資訊表單頁面')
})
//修改一筆餐廳資訊
app.post('/restaurants/:id/edit', (req, res) => {
  res.send('修改一筆餐廳')
})
//刪除一筆餐廳
app.post('/restaurants/:id/delete', (req, res) => {
  res.send('刪除一筆餐廳')
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
