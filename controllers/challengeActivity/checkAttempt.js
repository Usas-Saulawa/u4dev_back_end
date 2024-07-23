const Challenge = require('../../models/challenge')
const checkAttempt = (req, res) => {
  const { user, domain, challengeTitle } = req.body
  handleActivity()
  async function handleActivity() {
    try {
      const challengeData = await Challenge.find({ challengeTitle, domain })
      if (challengeData.length > 0) {
        const { attemptedBy } = challengeData[0]
        if (attemptedBy.includes(user)) {
          res.json({
            attempted: true
          })
        } else {
          res.json({
            attempted: false
          })
        }
      } else {
        res.json({
          status: "FAILED",
          message: "This challenge doesn't exist"
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

module.exports = checkAttempt