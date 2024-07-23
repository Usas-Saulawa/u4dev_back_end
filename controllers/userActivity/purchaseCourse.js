const Realm = require('../../models/realms')
const User = require('../../models/user')
require('dotenv').config()


const purchaseCourse = (req, res) => {
  const { realm, user, courseId, type } = req.body
  checkAndSend()
  async function checkAndSend() {
    try {
      const tokenPrice = process.env.TOKEN_PRICE
      const realmData = await Realm.find({ realm })
      if (realmData.length > 0) {
        const { courses } = realmData[0]
        const userData = await User.find({ email: user })
        let { coursesBought, tokens, typesAccessed } = userData[0]
        let coursesUpdate = []
        courses.forEach(cose => {
          let { realm, course, info, options, ratings, _id, boughtBy, amount, vid, nail } = cose
          let upgraded = { ...cose }
          if (courseId == _id) {
            if (boughtBy.includes(user) && coursesBought.includes(_id)) {
              if (!typesAccessed.includes(type) && options.includes(type)) {
                if (amount > tokens) {
                  res.json({
                    status: "FAILED",
                    message: "Insufficient tokens",
                    tokens,
                    perOne: Number(tokenPrice)
                  })
                } else {
                  boughtBy = [...boughtBy, user]
                  coursesBought = [...coursesBought, _id]
                  tokens -= amount
                  typesAccessed = [...typesAccessed, type]
                  upgraded = { ...upgraded, boughtBy }
                }
              } else {
                res.json({ status: "FAILED", message: "course already bought" })
              }
            } else {
              if (amount > tokens) {
                res.json({
                  status: "FAILED",
                  message: "Insufficient tokens",
                  tokens,
                  perOne: Number(tokenPrice)
                })
              } else {
                boughtBy = [...boughtBy, user]
                coursesBought = [...coursesBought, _id]
                tokens -= amount
                typesAccessed = [...typesAccessed, type]
                upgraded = { ...upgraded, boughtBy }

                res.json({
                  status: "SUCCESS",
                  message: "Purchased"
                })
              }
            }
          }
          coursesUpdate = [...coursesUpdate, upgraded]
        })
        await User.updateOne({ email: user }, { coursesBought, typesAccessed, tokens })
        await Realm.updateOne({ realm }, { courses: coursesUpdate })
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
module.exports = purchaseCourse