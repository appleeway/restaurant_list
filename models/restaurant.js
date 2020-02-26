const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  name_en: String,
  category: String,
  image: [String],
  location: String,
  phone: Number,
  google_map: [String],
  rating: Number,
  description: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)