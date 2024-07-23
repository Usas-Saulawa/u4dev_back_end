const mongoose = require('mongoose')


const challengeSchema = new mongoose.Schema({
  challengeTitle: String,
  attempts: {
    type: Number,
    default: 0
  },
  realm: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  marks: Number,
  attemptedBy: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('u4challenge', challengeSchema)