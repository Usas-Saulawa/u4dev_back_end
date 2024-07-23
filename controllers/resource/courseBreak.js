const Realm = require('../../models/realms')
const User = require('../../models/user')
const Video = require('../../models/video')


const loadBreak = (req, res) => {
  const { realm, user, type, id, course } = req.body
  checkAndSend()
  async function checkAndSend() {
    try {
      const realmData = await Realm.find({ realm })
      if (realmData.length > 0) {
        const { courses } = realmData[0]
        if (courses.length > 0) {
          const userData = await User.find({ email: user })
          const { goals, typesAccessed } = userData[0]

          const queried = courses.filter(cose => {
            const { _id } = cose
            return _id == id
          })
          if (queried.length > 0) {
            const { content, amount } = queried[0]
            if (typesAccessed.includes(type) || amount == 0) {
              const result = content.filter(cont => {
                return cont.type == type
              })
              if (goals.length > 0) {
                if (goals.length > 1) {
                  const numberOfVideos = await Video.find({ domain: goals[1].domain })
                  if (numberOfVideos.length > 0) {
                    goals[1].total = numberOfVideos.length
                  }
                }
                const numberOfVideos = await Video.find({ domain: goals[0].domain })
                if (numberOfVideos.length > 0) {
                  goals[0].total = numberOfVideos.length
                }
              }
              res.json({
                status: "SUCCESS",
                result,
                goals
              })
            } else {
              console.log("This is wrong")
            }
          } else {
            res.json({
              status: "FAILED",
              message: "No such course"
            })
          }
          courses.map(cose => {
          })
        }
      } else {
        res.json({
          status: "FAILED",
          message: "This realm does not exist"
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }
}
module.exports = loadBreak