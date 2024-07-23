const mongoose = require('mongoose')


const transactSchema = new mongoose.Schema({
  tx_ref: String,
  amount: String,
  email: String,
  amountToPay: Number,
})

module.exports = mongoose.model('u4transacts', transactSchema)