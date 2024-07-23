const Video = require('../../models/video')
const User = require('../../models/user')
const transporter = require('../nodemailer/transporter')
require('dotenv').config()


const uploadVideo = (req, res) => {
  const { user, videoName, realm, domain, description, language, instructor, duration, thumbnail, stampName, externalLinks, readables } = req.body
  if (user === 'usassaulawa00@gmail.com') {
    checkAndSave()
    async function checkAndSave() {
      try {
        const newVideo = new Video({
          videoName,
          description,
          language,
          realm,
          domain,
          instructor,
          duration,
          thumbnail,
          stampName,
          externalLinks,
          readables
        })
        const data = await newVideo.save()
        const result = await User.find({ realm: realm })
        if (result.length > 0) {
          let emails = []
          result.map(person => {
            emails.push(person.email)
          })
          if (emails.length > 0) {
            const mailOptions = {
              from: process.env.AUTH_EMAIL,
              to: emails,
              subject: 'New Video Uploaded',
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
            message: "No users in this realm",
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
module.exports = uploadVideo