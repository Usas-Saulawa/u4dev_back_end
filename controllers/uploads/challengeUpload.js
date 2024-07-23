const Challenge = require('../../models/challenge')
const transporter = require('../nodemailer/transporter')
const User = require('../../models/user')
require('dotenv').config()


const uploadChallenge = (req, res) => {
  const { user, challengeTitle, domains, marks } = req.body
  if (user === 'usassaulawa00@gmail.com') {
    checkAndSave()
    async function checkAndSave() {
      try {
        const newChallenge = new Challenge({
          challengeTitle,
          domains,
          marks
        })
        const data = await newChallenge.save()
        let result
        domains.map(async (dom) => {
          try {
            const users = await User.find({ domain: dom })
            result = [...result, ...users]
          } catch (error) {
            console.log(error)
          }
        })
        if (result.length > 0) {
          let emails = []
          result.map(person => {
            emails.push(person.email)
          })
          if (emails.length > 0) {
            const mailOptions = {
              from: process.env.AUTH_EMAIL,
              to: emails,
              subject: 'New challenge',
              html: ``
            }
            await transporter.sendMail(mailOptions)
            res.json({
              status: "SUCCESS",
              message: "Email sent to relevant users",
              data: data,
            })
          }
        } else {
          res.json({
            status: "SUCCESS",
            message: "No users in this domain",
            data: data
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
  } else {
    res.json({
      status: "FAILED",
      message: "Invalid upload"
    })
  }




}
module.exports = uploadChallenge