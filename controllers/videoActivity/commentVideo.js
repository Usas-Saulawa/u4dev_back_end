const User = require("../../models/user")
const Video = require('../../models/video')
const commentVideo = (req, res) => {
  const { user, videoName, comment, domain } = req.body
  handleActivity()
  async function handleActivity() {
    try {
      const userData = await User.find({ email: user })
      if (userData.length > 0) {
        const { commentedVideos, fullName } = userData[0]
        const videoData = await Video.find({ videoName, domain })
        if (videoData.length > 0) {
          const commentData = { user: fullName, comment, date: Date.now() }
          const { comments } = videoData[0]
          const updated = [...comments, commentData]
          const commented = [...commentedVideos, videoName]
          await Video.updateOne({ videoName, domain }, { comments: [...updated] })
          await User.updateOne({ email: user }, { commentedVideos: [...commented] })
          res.json({
            commentData: { ...commentData }
          })
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

module.exports = commentVideo