const mongoose = require("mongoose")


const activitySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  activeByNum: {
    type: Number,
    default: 0,
  },
  activeUsers: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('u4activity', activitySchema)