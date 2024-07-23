const User = require('../../models/user')
const Message = require('../../models/msgStore')
const readAllMessages = (req, res) => {
  const { user } = req.body
  checkActivity()
  async function checkActivity() {
    try {
      const userData = await User.find({ email: user })
      if (userData.length > 0) {
        const { roomID } = userData[0]
        const messageData = await Message.find({ roomID })
        if (messageData.length > 0) {
          const { messages } = messageData[0]
          messages.forEach(msg => {
            msg.read = true
          })
          await Message.updateOne({ roomID }, { messages: messages })
        } else {
          res.json({
            status: "FAILED",
            message: "Something went wrong"
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
    }
  }
}
module.exports = readAllMessages