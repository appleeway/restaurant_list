// routes/home.js
const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')

// 載入 auth middleware 裡的 authenticated 方法
const { authenticated } = require('../config/auth')

// 加入 authenticated 驗證
// 餐廳首頁
router.get('/', authenticated, (req, res) => {
  Restaurant.find({ userId: req.user._id })
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      res.render('index', { restaurants })
    })
})
//餐廳搜尋
router.get('/search', authenticated, (req, res) => {
  const keyword = req.query.keyword
  Restaurant.find({
    $and: [
      { userId: req.user._id },
      { $or: [{ name: { $regex: keyword } }, { category: { $regex: keyword } }, { name_en: { $regex: keyword, $options: 'i' } }] }
    ]
  })
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      res.render('index', { restaurants, keyword })
    })
})
//餐廳排序
router.get('/sort', authenticated, (req, res) => {
  Restaurant.find({ userId: req.user._id })
    .sort({ rating: 'desc' })
    .lean()
    .exec((err, restaurants) => {
      if (err) return console.error(err)
      res.render('index', { restaurants })
    })
})

module.exports = router