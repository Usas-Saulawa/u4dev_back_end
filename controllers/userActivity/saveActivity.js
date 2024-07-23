const User = require('../../models/user')
const Activity = require('../../models/activity')
const moment = require('moment')
const updateActiveUsers = (req, res) => {
  const { user } = req.body
  checkActivity()
  async function checkActivity() {
    try {
      const users = await User.find({ email: user })
      if (users.length > 0) {
        const { fullName, email } = users[0]
        let activitySummary = users[0].activitySummary
        const today = moment(Date.now()).format("LL")
        const dayStarted = await Activity.find({ date: today })
        if (dayStarted.length > 0) {
          const { activeUsers, activeByNum, date } = dayStarted[0]
          let alreadyActiveToday = false
          activeUsers.forEach(person => {
            if (person.fullName === fullName && person.email === email) {
              person.online += 1
              alreadyActiveToday = true
            }
          })
          if (alreadyActiveToday) {
            await Activity.updateOne({ date: date }, { activeUsers: activeUsers, activeByNum: Number(activeByNum + 1) })
          } else {
            const updatedAct = [...activeUsers, { fullName, email, online: 1 }]
            await Activity.updateOne({ date }, { activeUsers: updatedAct, activeByNum: Number(activeByNum + 1) })
            if (!activitySummary.includes(today)) {
            }
          }
        } else {
          const today = String(moment(Date.now()).format("LL"))
          const newAct = new Activity({
            date: today,
            activeByNum: 1,
            activeUsers: [{ online: 1, fullName, email }]
          })
          await newAct.save()
          await User.updateOne({ email: user }, { activitySummary: [...activitySummary, today] })
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
module.exports = updateActiveUsers