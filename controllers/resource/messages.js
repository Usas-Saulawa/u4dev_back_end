const User = require('../../models/user')
const Message = require('../../models/msgStore')


const loadMessages = (req, res) => {
  const { user } = req.body

  checkAndSend()
  async function checkAndSend() {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const { roomID, fullName } = data[0]
        const result = await Message.find({ roomID })
        if (result.length > 0) {
          const { messages } = result[0]
          if (messages.length > 0) {
            res.json({
              status: "SUCCESS",
              messages,
              user: fullName
            })
          } else {
            res.json({
              status: "FAILED",
              message: "There are no messages in this room"
            })
          }
        } else {
          res.json({
            status: "FAILED",
            message: "There is no room for this user"
          })
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
module.exports = loadMessages