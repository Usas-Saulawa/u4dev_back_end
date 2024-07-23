const User = require("../../models/user")
const Video = require('../../models/video')
const transporter = require("../nodemailer/transporter")
const completedVideo = (req, res) => {
  const { user, videoName, domain } = req.body
  handleActivity()
  async function handleActivity() {
    try {
      const vidData = await Video.find({ domain })
      const userData = await User.find({ email: user })
      if (userData.length > 0) {
        const totalInDomain = vidData.length
        let { goals, completedCourses } = userData[0]
        const currentGoal = goals.filter((goal, i) => {
          return goal.domain == domain
        })
        if (currentGoal.length > 0) {
          let goalIndex = goals.indexOf(currentGoal[0])
          if (!goals[goalIndex].completed.includes(videoName)) {
            goals[goalIndex].completed.push(videoName)
            await User.updateOne({ email: user }, { goals })
          }
          if (goals[goalIndex].completed.length == totalInDomain) {
            const mailOptions = {
              from: process.env.AUTH_EMAIL,
              to: user,
              subject: domain + ' course completed',
              html: `
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px;">
                  <div style="text-align: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px;">
                    <img src="https://u4dev.online/resource/image/logo" alt="U4DEV Logo" style="max-width: 150px;" />
                    <h1 style="color: #333333;">Congratulations</h1>
                  </div>
                  <div style="margin-top: 20px;">
                    <p style="color: #555555; line-height: 1.6;">
                      We're excited to announce to you that your ${domain} course has been completed. Contact help.u4dev@gmail.com to request for a certificate.</p>
                    <p style="color: #555555; line-height: 1.6;">
                     Keep learning at U4DEV so that we can congratulate you more on your successes.
                    </p>
                    <p style="color: #555555; line-height: 1.6;">
                      Congratulations once again.
                    </p>
                  </div>
                  <div style="margin-top: 30px; text-align: center;">
                    <p style="color: #777777; font-size: 0.9em;"><br />The U4DEV Team</p>
                  </div>
                </div>
                </div >
                `
            }
            await transporter.sendMail(mailOptions)
            await User.updateOne({ email: user }, { completedCourses: [...completedCourses, domain], goals: goalIndex == 0 ? [goals[1]] : [goals[0]] })
          }
        } else {
          return
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

module.exports = completedVideo