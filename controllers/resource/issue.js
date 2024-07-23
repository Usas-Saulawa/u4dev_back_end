const User = require('../../models/user')
const Issue = require('../../models/issue')
const Message = require('../../models/msgStore')


const loadIssue = (req, res) => {
  const { user } = req.body

  checkAndSend()
  async function checkAndSend() {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const { notifications, roomID } = data[0]
        const realm = data[0].realm.split(' ')[0]
        const result = await Issue.find({ realm })
        const messagesData = await Message.find({ roomID })
        let newNot = false
        let newMsg = false
        if (messagesData.length > 0) {
          const { messages } = messagesData[0]
          messages.map(msg => {
            if (msg.read === false && msg.from === 'U4DEV') newMsg = true
          })
        }
        notifications.map(notification => {
          if (notification.read === false) newNot = true
        })
        if (result.length > 0) {
          res.json({
            status: "SUCCESS",
            result: result,
            notification: newNot,
            message: newMsg
          })
        } else {
          res.json({
            status: "FAILED",
            message: "No issues related to this domain"
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
module.exports = loadIssue