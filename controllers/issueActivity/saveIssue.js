const User = require("../../models/user")
const Issue = require('../../models/issue')
const transporter = require("../nodemailer/transporter")
const { v4: uuidv4 } = require('uuid')
const saveIssue = (req, res) => {
  const { user, issueTitle, issueDetails, realm, attachment } = req.body
  handleActivity()
  async function handleActivity() {
    try {
      const userData = await User.find({ email: user })
      if (userData.length > 0) {
        const issueID = uuidv4()
        const { postedIssues, fullName } = userData[0]
        const newAnswer = new Issue({
          issueTitle,
          realm,
          issueID,
          posterEmail: user,
          issueDetails,
          attachment,
          posterName: fullName
        })
        await newAnswer.save()
        const userUpdate = [...postedIssues, issueTitle]
        await User.updateOne({ email: user }, { postedIssues: userUpdate })
        res.json({
          status: "SUCCESS"
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

module.exports = saveIssue