const mongoose = require("mongoose")

const messagesSchema = new mongoose.Schema({
  roomID: String,
  new: Boolean,
  messages: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('u4messages', messagesSchema)