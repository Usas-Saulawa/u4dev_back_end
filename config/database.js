require('dotenv').config()
const mongoose = require("mongoose")


mongoose.connect(process.env.MDB_URI).then(() => {
  console.log('DB Connected!')
}).catch((err) => {
  console.log(err)
})