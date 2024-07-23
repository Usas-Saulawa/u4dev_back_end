const User = require("../../models/user")
const Video = require('../../models/video')
const likeVideo = (req, res) => {
  const { user, videoName, domain } = req.body
  handleActivity()
  async function handleActivity() {
    try {
      const userData = await User.find({ email: user })
      if (userData.length > 0) {
        const { likedVideos } = userData[0]
        const videoData = await Video.find({ videoName, domain })
        if (videoData.length > 0) {
          const { likes } = videoData[0]
          if (likes.includes(user)) {
            const liked = likedVideos.filter(i => i !== videoName)
            const updated = likes.filter(i => i !== user)
            await Video.updateOne({ videoName, domain }, { likes: [...updated] })
            await User.updateOne({ email: user }, { likedVideos: [...liked] })
          } else {
            const updated = [...likes, user]
            const liked = [...likedVideos, videoName]
            await Video.updateOne({ videoName, domain }, { likes: [...updated] })
            await User.updateOne({ email: user }, { likedVideos: [...liked] })
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

module.exports = likeVideo