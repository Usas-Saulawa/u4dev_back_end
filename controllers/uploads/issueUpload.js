const Issue = require('../../models/issue')
const { v4: uuidv4 } = require('uuid')
const transporter = require('../nodemailer/transporter')
require('dotenv').config()


const uploadIssue = (req, res) => {
  const { user, posterEmail, issueTitle, posterName, domains, solution } = req.body
  if (user === 'usassaulawa00@gmail.com') {
    checkAndSave()
    async function checkAndSave() {
      try {
        const issueID = uuidv4()
        const newIssue = new Issue({
          posterEmail,
          issueTitle,
          posterName,
          domains,
          solution,
          issueID,
        })
        const data = await newIssue.save()
        res.json({
          status: 'SUCCESS',
          data: data
        })
        const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: posterEmail,
          subject: 'Issue resolved',
          html: ``
        }
        await transporter.sendMail(mailOptions)
      } catch (error) {
        console.log(error)
        res.json({
          status: "FAILED",
          message: "Something went wrong"
        })
      }
    }
  } else {
    res.json({
      status: "FAILED",
      message: "Invalid upload"
    })
  }




}
module.exports = uploadIssue