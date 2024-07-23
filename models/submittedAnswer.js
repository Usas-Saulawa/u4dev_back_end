const mongoose = require('mongoose')


const answerSchema = new mongoose.Schema({
  user: String,
  gitHubUrl: String,
  answer: String,
  challengeTitle: String,
  domain: String,
})

module.exports = mongoose.model('u4challengeAnswers', answerSchema)