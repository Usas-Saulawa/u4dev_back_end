const User = require('../../models/user')
const Issue = require('../../models/issue')


const issueFetch = (req, res) => {
  const { user } = req.body
  const { issueID } = req.params

  checkAndSend()
  async function checkAndSend() {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const { domain, viewedIssues } = data[0]
        const result = await Issue.find({ issueID })
        if (result.length > 0) {
          const { views } = result[0]
          res.json({
            status: "SUCCESS",
            user: user,
            result: result[0],
            views: views === undefined ? 1 : Number(views + 1)
          })
          await Issue.updateOne({ issueID }, { views: views === undefined ? 1 : Number(views + 1) })
          await User.updateOne({ email: user }, { viewedIssues: viewedIssues === undefined ? 1 : Number(viewedIssues + 1) })
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
module.exports = issueFetch