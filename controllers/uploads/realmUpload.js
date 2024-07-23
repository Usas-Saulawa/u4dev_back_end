const Realm = require('../../models/realms')
const User = require('../../models/user')
const transporter = require('../nodemailer/transporter')
require('dotenv').config()


const uploadRealm = (req, res) => {
  const { user, realm, courses } = req.body
  if (user === 'usassaulawa00@gmail.com') {
    checkAndSave()
    async function checkAndSave() {
      try {
        const newRealm = new Realm({
          realm,
          courses
        })
        const data = await newRealm.save()
        res.json({
          status: "SUCCESS",
          message: "Realm information added",
          data: data,
        })
      } catch (error) {
        console.log(error)
        res.json({
          status: "FAILED",
          message: "Something went wrong"
        })
      }
    }
  } else {
    res.json({
      status: "FAILED",
      message: "Invalid upload"
    })
  }
}
module.exports = uploadRealm