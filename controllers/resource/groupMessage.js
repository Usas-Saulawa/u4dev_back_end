const User = require('../../models/user')
const Message = require('../../models/public')
const moment = require("moment")

const loadPublicMessages = (req, res) => {
  const { user } = req.body

  checkAndSend(0)
  async function checkAndSend(num) {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const today = moment(Date.now() - (num * 86400000)).format("LL")
        const { fullName } = data[0]
        const result = await Message.find({ date: today })
        if (result.length > 0) {
          const { messages } = result[0]
          if (messages.length > 0) {
            res.json({
              status: "SUCCESS",
              messages,
              fullName
            })
          } else {
            if (num >= 10) {
              res.json({
                status: "FAILED",
                message: "No message",
                fullName
              })
            } else {
              checkAndSend(num += 1)
            }
          }
        } else {
          if (num >= 15) {
            res.json({
              status: "FAILED",
              message: "No message",
              fullName,
            })
          } else {
            checkAndSend(num += 1)
            console.log(`No record for ${moment(Date.now() - (num * 86400000)).format("LL")}`)
          }
        }
      } else {
        res.json({
          status: "FAILED",
          message: "Something went wrong"
        })
      }
    } catch (error) {
      console.log(error)
      res.json({
        status: "FAILED",
        message: "Something went wrong"
      })
    }
  }
}
module.exports = loadPublicMessages