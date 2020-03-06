// routes/restaurant.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')


//新增一筆餐廳頁面
router.get('/new', (req, res) => {
  res.render('new')
})
//新增一筆餐廳資料
router.post('/', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  const restaurant = new Restaurant({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description
  })
  restaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})
//顯示所有餐廳資訊
router.get('/', (req, res) => {
  return res.redirect('/')
})
//顯示特定餐廳詳細資訊
router.get('/:id', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('show', { restaurant })
    })
})
//修改一筆餐廳頁面
router.get('/:id/edit', (req, res) => {
  Restaurant.findById(req.params.id)
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('edit', { restaurant })
    })
})
//修改一筆餐廳資訊
router.put('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body

    restaurant.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})
//刪除一筆餐廳
router.delete('/:id', (req, res) => {
  Restaurant.findById(req.params.id, (err, restaurant) => {
    if (err) return console.error(err)
    restaurant.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router