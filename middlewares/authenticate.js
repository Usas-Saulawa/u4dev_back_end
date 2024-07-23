require('dotenv').config()
const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
  const { reqToken } = req.body
  if (reqToken == null || reqToken == 'undefined') {
    return res.json({
      status: 'FAILED',
      message: 'Invalid token!'
    })
  }
  jwt.verify(reqToken, process.env.SECRET_KEY, (error, user) => {
    if (error) {
      return res.json({
        status: 'FAILED',
        message: 'Invalid token!'
      })
    }
    req.body.user = user.user
    next()
  })
}
module.exports = authenticate