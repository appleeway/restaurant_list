// routes/restaurant.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

const { authenticated } = require('../config/auth')

//新增一筆餐廳頁面
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})
//新增一筆餐廳資料
router.post('/', authenticated, (req, res) => {
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
    description,
    userId: req.user._id
  })
  restaurant.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})
//顯示所有餐廳資訊
router.get('/', authenticated, (req, res) => {
  return res.redirect('/')
})
//顯示特定餐廳詳細資訊
router.get('/:id', authenticated, (req, res) => {
  Restaurant.findOne({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('show', { restaurant })
    })
})
//修改一筆餐廳頁面
router.get('/:id/edit', authenticated, (req, res) => {
  Restaurant.findOne({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, restaurant) => {
      if (err) return console.error(err)
      return res.render('edit', { restaurant })
    })
})
//修改一筆餐廳資訊
router.put('/:id', authenticated, (req, res) => {
  Restaurant.findById({ _id: req.params.id, userId: req.user._id }, (err, restaurant) => {
    if (err) return console.error(err)

    Object.assign(restaurant, req.body)

    restaurant.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${req.params.id}`)
    })
  })
})
//刪除一筆餐廳
router.delete('/:id', authenticated, (req, res) => {
  Restaurant.findById({ _id: req.params.id, userId: req.user._id }, (err, restaurant) => {
    if (err) return console.error(err)
    restaurant.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router