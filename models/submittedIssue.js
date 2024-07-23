const mongoose = require('mongoose')


const issueStoreSchema = new mongoose.Schema({
  user: String,
  issueTitle: String,
  issueDetail: String,
  domain: String,
})

module.exports = mongoose.model('u4issueStore', issueStoreSchema)