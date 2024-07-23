const mongoose = require('mongoose')


const videoSchema = new mongoose.Schema({
  videoName: String,
  domain: String,
  description: String,
  comments: {
    type: Array,
    default: []
  },
  likes: {
    type: Array,
    default: []
  },
  language: String,
  instructor: String,
  duration: String,
  thumbnail: String,
  views: Number,
  stampName: String,
  externalLinks: {
    type: Array,
    default: []
  },
  readables: {
    type: Array,
    default: []
  },
  realm: String,
})

module.exports = mongoose.model('u4videos', videoSchema)