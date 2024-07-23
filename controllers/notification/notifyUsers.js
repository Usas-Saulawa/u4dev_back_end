const User = require('../../models/user')
const notifyUsers = (req, res) => {
  checkActivity()
  async function checkActivity() {
    try {
      const { user, targetAll, message, domain } = req.body
      if (user === 'usassaulawa00@gmail.com') {
        if (targetAll) {
          const users = await User.find({})
          if (users.length > 0) {
            users.map(async (person) => {
              try {
                const { notifications, email } = person
                const updatedNotification = [...notifications, { notification: message, date: Date.now(), read: false }]
                await User.updateOne({ email }, { notifications: updatedNotification })
              } catch (error) {
                console.log(error)
              }
            })
            res.json({
              status: "FAILED",
              message: "All users notified"
            })
          } else {
            res.json({
              status: "FAILED",
              message: "Something went wrong"
            })
          }

        } else {
          const users = await User.find({ domain })
          if (users.length > 0) {
            users.map(async (person) => {
              try {
                const { notifications, email } = person
                const updatedNotification = [...notifications, { notification: message, date: Date.now() }]
                await User.updateOne({ email }, { notifications: updatedNotification })
              } catch (error) {
                console.log(error)
              }
            })
            res.json({
              status: "FAILED",
              message: "All users with domain " + domain + " are notified"
            })
          } else {
            res.json({
              status: "FAILED",
              message: "No users in this domain"
            })
          }
        }
      } else {
        res.json({
          status: "FAILED",
          message: "Invalid upload"
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
module.exports = notifyUsers