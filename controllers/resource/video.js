const User = require('../../models/user')
const Video = require('../../models/video')


const loadVideo = (req, res) => {
  const { user, domain } = req.body
  let { language } = req.body

  checkAndSend()
  async function checkAndSend() {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const result = await Video.find({ domain })
        if (result.length > 0) {
          res.json({
            status: "SUCCESS",
            lang: language,
            result: result
          })
        } else {
          res.json({
            status: "FAILED",
            lang: language,
            message: "No videos yet"
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
module.exports = loadVideo