// Requesting the students model
const User = require('../../models/user')

// Dotenv
require('dotenv').config()

// Importing bcrypt stuff
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const logUser = (req, res) => {
  let { email, password } = req.body
  if (!email || !password) {
    return res.json({
      status: "FAILED",
      message: "Empty input fields"
    })
  }

  if (password == '' || email == '') {
    res.json({
      status: 'FAILED',
      message: 'empty input fields'
    })
  } else {
    checkUserRecord()
    async function checkUserRecord() {
      try {
        const data = await User.find({ email })
        if (data.length > 0) {
          const checkHash = await bcrypt.compare(password, data[0].password)
          if (checkHash) {
            const reqToken = jwt.sign({ user: email }, process.env.SECRET_KEY)
            res.json({
              status: 'SUCCESS',
              token: reqToken
            })
          } else {
            res.json({
              status: 'FAILED',
              message: 'Incorrect password! try again'
            })
          }
        } else {
          res.json({
            status: 'FAILED',
            message: "This user doesn't exist"
          })
        }
      } catch (error) {
        console.log(error);
        res.json({
          status: 'FAILED',
          message: 'Something went wrong'
        })
      }
    }
  }
}



module.exports = logUser