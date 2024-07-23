const User = require("../../models/user")
const Video = require('../../models/video')
const playlistVideo = (req, res) => {
  const { user, videoName, domain } = req.body
  handleActivity()
  async function handleActivity() {
    try {
      const userData = await User.find({ email: user })
      if (userData.length > 0) {
        const { playlist } = userData[0]
        const videoData = await Video.find({ videoName, domain })
        if (videoData.length > 0) {
          const { videoName, domain, thumbnail, stampName } = videoData[0]
          let playlisted = false
          playlist.map(item => {
            if (item.videoName === videoName && item.domain === domain) return playlisted = true
          })
          if (playlisted) {
            const playlistUpdate = playlist.filter(i => i.videoName !== videoName && i.domain !== domain)
            await User.updateOne({ email: user }, { playlist: [...playlistUpdate] })
          } else {
            const playlistUpdate = [...playlist, { videoName, domain, thumbnail, stampName }]
            await User.updateOne({ email: user }, { playlist: [...playlistUpdate] })
          }
        } else {
          res.json({
            status: "FAILED",
            message: "This video doesn't exist"
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

module.exports = playlistVideo