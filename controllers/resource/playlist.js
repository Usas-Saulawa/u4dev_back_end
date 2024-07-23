const User = require('../../models/user')
const Issue = require('../../models/issue')


const loadPlaylist = (req, res) => {
  const { user } = req.body

  checkAndSend()
  async function checkAndSend() {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const { playlist } = data[0]
        res.json({
          status: "SUCCESS",
          playlist
        })
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
module.exports = loadPlaylist