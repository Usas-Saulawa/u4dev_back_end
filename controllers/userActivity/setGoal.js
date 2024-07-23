const Video = require('../../models/video')
const User = require('../../models/user')


const setGoal = (req, res) => {
  const { user, domain, date } = req.body
  checkAndSave()
  async function checkAndSave() {
    try {
      const videoData = await Video.find({ domain })
      if (videoData.length > 0) {
        const userData = await User.find({ email: user })
        if (userData.length > 0) {
          const { completedCourses, goals } = userData[0]
          if (completedCourses.includes(domain)) {
            res.json({
              status: "FAILED",
              message: "Already completed"
            })
          } else {
            if (goals.length >= 2) {
              res.json({
                status: "FAILED",
                message: "You can only set two goals at a time"
              })
            } else {
              let already = goals.filter(goal => goal.domain == domain)
              if (already) {
                res.json({
                  status: "SUCCESS",
                  message: "Already a goal"
                })
              } else {

                const goalsUpdated = [...goals, {
                  domain,
                  date: date.timestamp,
                  completed: [],

                }]
                await User.updateOne({ email: user }, { goals: [...goalsUpdated] })
                res.json({
                  status: "SUCCESS",
                  message: "Added Successfully"
                })
              }

            }
          }
        } else {
          res.json({
            status: "FAILED",
            message: "Something went wrong"
          })
        }
      } else {
        res.json({
          status: "FAILED",
          message: "No such domain in our records"
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }
}
module.exports = setGoal