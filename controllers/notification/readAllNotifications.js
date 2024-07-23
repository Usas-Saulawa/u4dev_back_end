const User = require('../../models/user')
const readAllNotifications = (req, res) => {
  checkActivity()
  async function checkActivity() {
    try {
      const { user } = req.body
      const users = await User.find({ email: user })
      if (users.length > 0) {
        const { notifications } = users[0]
        notifications.forEach(notification => {
          notification.read = true
        })
        await User.updateOne({ email: user }, { notifications })
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
module.exports = readAllNotifications