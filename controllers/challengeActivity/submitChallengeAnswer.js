const User = require("../../models/user")
const Answer = require('../../models/submittedAnswer')
const Challenge = require("../../models/challenge")
const saveAttempt = (req, res) => {
  const { user, challengeAnswer, GitHubUrl, challengeTitle } = req.body
  handleActivity()
  async function handleActivity() {
    try {
      const userData = await User.find({ email: user })
      if (userData.length > 0) {
        const { attemptedChallenges, domain } = userData[0]
        const newAnswer = new Answer({
          challengeTitle,
          domain,
          user,
          answer: challengeAnswer,
          gitHubUrl: GitHubUrl
        })
        await newAnswer.save()
        const chalData = await Challenge.find({ domain, challengeTitle })
        if (chalData.length > 0) {
          const { attemptedBy, domain, attempts } = chalData[0]
          if (attemptedBy.includes(user)) {
            res.json({
              status: "FAILED",
              message: 'Answer already submitted by user'
            })
          } else {
            const updated = [...attemptedBy, user]
            const userUpdate = [...attemptedChallenges, challengeTitle]
            const attemptsUpdate = Number(attempts + 1)
            await Challenge.updateOne({ challengeTitle, domain }, { attemptedBy: updated, attempts: attemptsUpdate })
            await User.updateOne({ email: user }, { attemptedChallenges: userUpdate })
            res.json({
              status: "SUCCESS"
            })
          }
        } else {
          res.json({
            status: "FAILED",
            message: "This challenge does not exist"
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

module.exports = saveAttempt