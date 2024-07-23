const User = require('../../models/user')
const Challenge = require('../../models/challenge')


const loadChallenge = (req, res) => {
  const { user } = req.body

  checkAndSend()
  async function checkAndSend() {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const realm = data[0].realm.split(' ')[0]

        const result = await Challenge.find({ realm })
        if (result.length > 0) {
          res.json({
            status: "SUCCESS",
            result: result
          })
        } else {
          res.json({
            status: "FAILED",
            message: "No challenges related to this realm"
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
module.exports = loadChallenge