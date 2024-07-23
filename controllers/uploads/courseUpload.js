const Course = require('../../models/courses')
const Realm = require('../../models/realms')
const User = require('../../models/user')
const transporter = require('../nodemailer/transporter')
require('dotenv').config()


const uploadCourse = (req, res) => {
  const { user, realm, course, content, amount, options, info, nail, vid } = req.body
  if (user === 'usassaulawa00@gmail.com') {
    checkAndSave()
    async function checkAndSave() {
      try {
        const courseData = await Course.find({ realm, course })
        if (courseData.length > 0) return res.json({ status: "FAILED", message: "Course Already Exist" })
        const newCourse = new Course({
          realm,
          course,
          content,
          amount,
          options,
          info,
          nail,
          vid
        })
        const data = await newCourse.save()
        const realmData = await Realm.find({ realm })
        const { courses } = realmData[0]
        let already
        courses.map(cose => {
          if (cose.course == course) {
            return null
          } else {
            return already = true
          }
        })
        await Realm.updateOne({ realm }, { realm, courses: [...courses, data] })
        const result = await User.find({ realm })
        if (result.length > 0) {
          let emails = []
          result.map(person => {
            emails.push(person.email)
          })
          if (emails.length > 0) {
            const mailOptions = {
              from: process.env.AUTH_EMAIL,
              to: emails,
              subject: 'New Course',
              html: `
                <div style="font-family: Arial, sans-serif; background-color: #525f5f; padding: 20px;">
                    <div
                        style="max-width: 600px; margin: 0 auto; background-color: #f2f2f2; border-radius: 8px; box-shadow: 0 0 8px rgb(0, 0, 0); overflow: hidden;">
                        <div style="padding: 20px; text-align: center;">
                            <h2 style="color: #525f5f;">Hello,</h2>
                            <p style="color: #525f5f;">We're thrilled to announce to you that a new course is now available. The
                                course is related to your area of interest </p>
                            <h3 style="color: #525f5f;">Go deeper in your field</h3>
                            <p style="color: #555555;">Our priority at U4DEV is always to:</p>
                            <ul
                                style="list-style-type: none; padding: 0; color: #555555; text-align: left; margin: 20px auto; max-width: 80%;">
                                <li style="margin-bottom: 10px;">✔ Help you deepen your knowledge in your field.</li>
                                <li style="margin-bottom: 10px;">✔ Provide you with practical strategies to excel.</li>
                                <li style="margin-bottom: 10px;">✔ Make you aware of the new trends in your field.</li>
                            </ul>
                            <p style="color: #555555;">Check the course out and share your thoughts with us. We love hearing from
                                you.</p>
                            <p style="text-align: center; margin-top: 30px;color: #555555;">We look forward to your feedback and hope you find the content valuable and
                                inspiring.</p>
                            <p style="color: #555555;">Best regards,</p>
                            <p style="color: #555555;">The U4DEV Team</p>
                        </div>
                    </div>
                </div>
              `
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
module.exports = uploadCourse