const mongoose = require('mongoose')


const courseSchema = new mongoose.Schema({
  realm: String,
  course: String,
  content: {
    type: Array,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  info: String,
  ratings: {
    type: Number,
    default: 0
  },
  boughtBy: {
    type: Array,
    default: [],
  },
  reviews: {
    type: Array,
    default: []
  },
  options: {
    type: Array,
    default: [],
    required: true
  },
  vid: {
    type: Boolean,
    default: false
  },
  nail: String
})

module.exports = mongoose.model('u4courses', courseSchema)