const User = require('../../models/user')
const Activity = require('../../models/activity')
const Video = require('../../models/video')
require("dotenv").config()

const loadProfile = (req, res) => {
  const { user } = req.body

  checkAndSend()
  async function checkAndSend() {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const { fullName,
          marks,
          experience,
          email,
          verified,
          starredIssues,
          watched,
          likedVideos,
          commentedVideos,
          issuesCommented,
          language,
          attemptedChallenges,
          postedIssues,
          tokens,
          goals,
          coursesBought,
          realm,
          playlist,
          activitySummary,
          completedCourses,
          viewedIssues,
          typesAccessed,
          referrals
        } = data[0]
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
        if (activitySummary.length >= 7) {
          const weekAction = activitySummary.slice(activitySummary.length - 7)
          let userIsActiveOn = []
          weekAction.map(async (action, i) => {
            const activeDate = await Activity.find({ date: action })
            if (activeDate.length > 0) {
              const { activeUsers } = activeDate[0]
              const userProfile = activeUsers.filter(person => {
                return person.email == user
              })
              userIsActiveOn = [...userIsActiveOn, userProfile[0]?.online]
            } else {
              userIsActiveOn = [...userIsActiveOn, 0]
            }
            if (i == 6) {
              res.json({
                fullName,
                email,
                marks,
                experience,
                verified,
                language,
                tokens,
                goals,
                realm,
                weekAction,
                userIsActiveOn,
                viewedIssues,
                typesAccessed: typesAccessed.length,
                starredIssues: starredIssues.length,
                watched: watched.length,
                likedVideos: likedVideos.length,
                commentedVideos: commentedVideos.length,
                issuesCommented: issuesCommented.length,
                attemptedChallenges: attemptedChallenges.length,
                postedIssues: postedIssues.length,
                coursesBought: coursesBought.length,
                playlist: playlist.length,
                completedCourses: completedCourses,
                perOne: process.env.TOKEN_PRICE,
                referrals: referrals.length
              })
            }
          })
        } else {
          let userIsActiveOn = [0, 0, 0, 0, 0, 0, 0]
          const workAround = ['', '', '', '', '', '', '', ...activitySummary]
          const weekAction = workAround.slice(workAround.length - 7)
          const validActions = weekAction.filter(i => i !== '')
          if (validActions.length > 0) {
            validActions.map(async (action, i) => {
              const activeDate = await Activity.find({ date: action })
              if (activeDate.length > 0) {
                const { activeUsers } = activeDate[0]
                const userProfile = activeUsers.filter(person => {
                  return person.email == user
                })
                userIsActiveOn = [...userIsActiveOn, userProfile[0]?.online]
              } else {
                userIsActiveOn = [...userIsActiveOn, 0]
              }
              if (i == validActions.length - 1) {
                userIsActiveOn = userIsActiveOn.slice(userIsActiveOn.length - 7)
                res.json({
                  fullName,
                  email,
                  marks,
                  experience,
                  verified,
                  language,
                  tokens,
                  goals,
                  realm,
                  userIsActiveOn,
                  weekAction,
                  viewedIssues,
                  typesAccessed: typesAccessed.length,
                  starredIssues: starredIssues.length,
                  watched: watched.length,
                  likedVideos: likedVideos.length,
                  commentedVideos: commentedVideos.length,
                  issuesCommented: issuesCommented.length,
                  attemptedChallenges: attemptedChallenges.length,
                  postedIssues: postedIssues.length,
                  coursesBought: coursesBought.length,
                  playlist: playlist.length,
                  completedCourses: completedCourses,
                  perOne: process.env.TOKEN_PRICE,
                  referrals: referrals.length
                })
              }
            })
          }
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
module.exports = loadProfile