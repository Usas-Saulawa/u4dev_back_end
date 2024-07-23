const path = require('path')

// Requesting the Models
const User = require('../../models/user')
const Message = require('../../models/msgStore')
const { v4: uuidv4 } = require('uuid')

// Importing bcrypt stuff
const bcrypt = require('bcryptjs')

// Import of transporter that will send the email
const transporter = require('../nodemailer/transporter')

// JWT import
const jwt = require('jsonwebtoken')

const signUser = (req, res) => {
  const { fullName, email, password, language, realm, experience, referrer } = req.body
  if (!fullName || !email || !password || !language || !realm || !experience) {
    return res.json({
      status: "FAILED",
      message: "Empty input fields"
    })
  }
  if (fullName == '' || language == '' || realm == '' || experience == '') {
    res.json({
      status: 'FAILED',
      message: 'empty input fields'
    })
  } else if (!/^[a-zA-Z].*[\s\.]*$/.test(fullName)) {
    res.json({
      status: 'FAILED',
      message: 'Invalid full name'
    })
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: 'FAILED',
      message: 'Invalid email'
    })
  } else if (password.length < 8) {
    res.json({
      status: 'FAILED',
      message: 'Password is too short'
    })
  } else {
    checkStudentRecord()
    async function checkStudentRecord() {
      try {
        const result = await User.find({ email })
        if (result.length > 0) {
          res.json({
            status: 'FAILED',
            message: 'User with this email already exist'
          })
        } else {
          const saltRounds = 10
          const hashedPassword = await bcrypt.hash(password, saltRounds)
          const roomID = uuidv4()
          const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            language,
            realm,
            experience,
            roomID,
            tokens: 5,
            referrer: referrer ? referrer : ''
          })
          const newRoom = new Message({
            roomID
          })
          const result = await newUser.save()
          await newRoom.save()
          if (referrer) {
            const referrerData = await User.find({ email: referrer })
            if (referrerData.length > 0) {
              const { referrals, tokens } = referrerData[0]
              await User.updateOne({ email: referrer }, { referrals: [...referrals, { fullName, email }], tokens: tokens + 1 })
            }
          }
          sendWelcomeEmail(result, res)
          async function sendWelcomeEmail({ email }, res) {
            try {
              const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: 'Welcome to U4DEV',
                html: `
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px;">
                  <div style="text-align: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px;">
                    <img src="https://u4dev.online/resource/image/logo" alt="U4DEV Logo" style="max-width: 150px;" />
                    <h1 style="color: #333333;">Welcome to U4DEV</h1>
                  </div>
                  <div style="margin-top: 20px;">
                    <p style="color: #555555; line-height: 1.6;">
                      We're excited to have you join our community of learners! At our platform, you will find a wealth of tech-related courses designed to enhance your skills and knowledge. Whether you're just starting or looking to advance your expertise, we are here to support you every step of the way.
                    </p>
                    <p style="color: #555555; line-height: 1.6;">
                      As you embark on this learning journey with us, rest assured that your success is our top priority. We are committed to providing you with the best resources and support to help you achieve your goals. Explore our courses, engage with fellow learners, and take your tech skills to new heights.
                    </p>
                    <p style="color: #555555; line-height: 1.6;">
                      Once again, welcome aboard! We look forward to celebrating your successes with you.
                    </p>
                  </div>
                  <div style="margin-top: 30px; text-align: center;">
                    <p style="color: #777777; font-size: 0.9em;">Happy Learning,<br />The U4DEV Team</p>
                  </div>
                </div>
                </div >
                `
              }
              await transporter.sendMail(mailOptions)
            } catch (error) {
              console.log(error);
            }
          }
          const reqToken = jwt.sign({ user: email }, process.env.SECRET_KEY)
          res.json({
            status: 'SUCCESS',
            message: 'User information stored successfully',
            token: reqToken
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
module.exports = signUser