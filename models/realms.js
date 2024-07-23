const mongoose = require('mongoose')


const realmSchema = new mongoose.Schema({
  realm: String,
  courses: {
    type: Array,
    required: true
  }
})

module.exports = mongoose.model('u4realms', realmSchema)