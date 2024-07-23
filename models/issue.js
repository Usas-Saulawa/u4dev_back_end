const mongoose = require('mongoose')


const issueSchema = new mongoose.Schema({
  posterEmail: {
    type: String,
    required: true
  },
  issueID: String,
  issueTitle: {
    type: String,
    required: true
  },
  stars: {
    type: Array,
    default: []
  },
  comments: {
    type: [{
      user: String,
      comment: String,
      date: Date,
    }],
    default: []
  },
  posterName: String,
  realm: {
    type: String,
    required: true
  },
  issueDetails: {
    type: Array,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  attachment: String
})

module.exports = mongoose.model('u4issue', issueSchema)