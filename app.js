//require packages used in the project 
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
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

//setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

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
  res.render('new')
})
//新增一筆餐廳資料
app.post('/restaurants', (req, res) => {
  const inputData = req.body
  const restaurant = new Restaurant({
    name: inputData.name,
    name_en: inputData.name_en,
    category: inputData.category,
    image: inputData.image,
    location: inputData.location,
    phone: inputData.phone,
    google_map: inputData.google_map,
    rating: inputData.rating,
    description: inputData.description
  })
  restaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})
//顯示所有餐廳資訊
app.get('/restaurants', (req, res) => {
  return res.redirect('/')
})
//顯示特定餐廳詳細資訊
app.get('/restaurants/:id', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('show', { restaurant })
    })
})
//修改一筆餐廳頁面
app.get('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('edit', { restaurant })
    })
})
//修改一筆餐廳資訊
app.post('/restaurants/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    restaurant.name = req.body.name,
      restaurant.name_en = req.body.name_en,
      restaurant.category = req.body.category,
      restaurant.image = req.body.image,
      restaurant.location = req.body.location,
      restaurant.phone = req.body.phone,
      restaurant.google_map = req.body.google_map,
      restaurant.rating = req.body.rating,
      restaurant.description = req.body.description
    restaurant.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})
//刪除一筆餐廳
app.post('/restaurants/:id/delete', (req, res) => {
  res.send('刪除一筆餐廳')
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
