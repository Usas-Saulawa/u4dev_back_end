const User = require("../../models/user")
const Issue = require('../../models/issue')
const transporter = require("../nodemailer/transporter")
const commentIssue = (req, res) => {
  const { user, issueID, comment } = req.body
  handleActivity()
  async function handleActivity() {
    try {
      const userData = await User.find({ email: user })
      if (userData.length > 0) {
        const { issuesCommented, fullName } = userData[0]
        const issueData = await Issue.find({ issueID })
        if (issueData.length > 0) {
          const commentData = { user: fullName, comment, date: Date.now() }
          const { comments, posterEmail } = issueData[0]
          console.log("This is it", posterEmail)
          console.log(issueData[0])
          const updated = [...comments, commentData]
          const starred = [...issuesCommented, issueID]
          await Issue.updateOne({ issueID }, { comments: [...updated] })
          await User.updateOne({ email: user }, { issuesCommented: [...starred] })
          res.json({
            commentData
          })
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: posterEmail,
            subject: 'Issue resolved',
            html: `
            <div style='width:90%; background-color:#525f5f;display:flex;flex-direction:column;align-items:center;padding:20px; box-shadow:0 0 10px grey;'>
              <h3 style="color:#f2f2f2;">Issue resolved</h3>
              <p style="color:#f2f2f2;">${fullName} has attempted resolving your Issue, Check it out.</p>
            </div>
            `
          }
          // if (posterEmail !== user) {
          await transporter.sendMail(mailOptions)
          // }
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

module.exports = commentIssue