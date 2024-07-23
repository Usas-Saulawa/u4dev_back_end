const Realm = require('../../models/realms')
const User = require('../../models/user')


const loadCourses = (req, res) => {
  const { realm, user } = req.body
  checkAndSend()
  async function checkAndSend() {
    try {
      const realmData = await Realm.find({ realm })
      if (realmData.length > 0) {
        const { courses } = realmData[0]
        let result = []
        if (courses.length > 0) {
          const userData = await User.find({ email: user })
          const { coursesBought, typesAccessed } = userData[0]
          courses.map(cose => {
            const { realm, course, info, options, ratings, _id, boughtBy, amount, vid, nail, content } = cose
            if ((coursesBought.includes(_id) && boughtBy.includes(user)) || amount == 0) {
              const filtered = { realm, course, info, options, ratings, id: _id, amount, paid: true, vid, nail, typesAccessed, content }
              result = [...result, filtered]
            } else {
              const filtered = { realm, course, info, options, ratings, id: _id, amount, vid, nail, typesAccessed, content }
              result = [...result, filtered]
            }
          })
          res.json({
            status: "SUCCESS",
            result,
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
module.exports = loadCourses