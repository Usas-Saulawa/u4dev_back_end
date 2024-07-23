const mongoose = require("mongoose")


const publicSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  messages: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('u4public', publicSchema)