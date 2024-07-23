const User = require('../../models/user')
const Issue = require('../../models/issue')


const loadNotifications = (req, res) => {
  const { user } = req.body

  checkAndSend()
  async function checkAndSend() {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const { notifications } = data[0]
        res.json({
          status: "SUCCESS",
          notifications
        })
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
module.exports = loadNotifications