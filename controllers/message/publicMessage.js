const User = require('../../models/user')
const GroupMessage = require('../../models/public')
const moment = require('moment')
const updateGroupChat = (req, res) => {
  const { user, message } = req.body
  checkActivity()
  async function checkActivity() {
    try {
      const users = await User.find({ email: user })
      const today = moment(Date.now()).format("LL")
      if (users.length > 0) {
        const { fullName } = users[0]
        const dayStarted = await GroupMessage.find({ date: today })
        if (dayStarted.length > 0) {
          const { messages, date } = dayStarted[0]
          await GroupMessage.updateOne({ date: date }, { messages: [...messages, { date: Date.now(), name: fullName, email: user, message: message }] })
          res.sendStatus(201)
        } else {
          const newAct = new GroupMessage({
            date: today,
            messages: [{ name: fullName, email: user, message, date: Date.now() }]
          })
          await newAct.save()
          res.sendStatus(201)
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
module.exports = updateGroupChat