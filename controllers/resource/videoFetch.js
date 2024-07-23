const User = require('../../models/user')
const Video = require('../../models/video')


const videoFetch = (req, res) => {
  const { user, videoName, domain } = req.body

  checkAndSend()
  async function checkAndSend() {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const { playlist, watched } = data[0]
        const result = await Video.find({ videoName, domain })
        if (result.length > 0) {
          const { videoName, domain, views } = result[0]
          let playlisted = false
          playlist.map(item => {
            if (item.videoName === videoName && item.domain === domain) return playlisted = true
          })
          let watchedAlready = false
          watched.map(item => {
            if (item.videoName === videoName && item.domain === domain) return watchedAlready = true
          })
          if (!watchedAlready) {
            const updated = [...watched, { videoName, domain }]
            await User.updateOne({ email: user }, { watched: updated })
          }
          res.json({
            status: "SUCCESS",
            user: user,
            result: result[0],
            playlisted,
            views: views === undefined ? 1 : Number(views + 1)
          })
          await Video.updateOne({ videoName, domain }, { views: views === undefined ? 1 : Number(views + 1) })
        } else {
          res.json({
            status: "FAILED",
            message: "Something went wrong"
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
module.exports = videoFetch