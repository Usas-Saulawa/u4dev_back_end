require('dotenv').config()
const jwt = require('jsonwebtoken')

const authIssueAttach = (req, res, next) => {
  const { reqToken } = req.params
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
module.exports = authIssueAttach