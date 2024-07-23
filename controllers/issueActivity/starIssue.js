const User = require("../../models/user")
const Issue = require('../../models/issue')
const starIssue = (req, res) => {
  const { user, issueID } = req.body
  handleActivity()
  async function handleActivity() {
    try {
      const userData = await User.find({ email: user })
      if (userData.length > 0) {
        const { starredIssues } = userData[0]
        const issueData = await Issue.find({ issueID })
        if (issueData.length > 0) {
          const { stars } = issueData[0]
          if (stars.includes(user)) {
            const starred = starredIssues.filter(i => i !== issueID)
            const updated = stars.filter(i => i !== user)
            await Issue.updateOne({ issueID }, { stars: [...updated] })
            await User.updateOne({ email: user }, { starredIssues: [...starred] })
          } else {
            const updated = [...stars, user]
            const starred = [...starredIssues, issueID]
            await Issue.updateOne({ issueID }, { stars: [...updated] })
            await User.updateOne({ email: user }, { starredIssues: [...starred] })
          }
        } else {
          res.json({
            status: "FAILED",
            message: "This issue doesn't exist"
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

module.exports = starIssue