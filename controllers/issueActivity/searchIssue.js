const User = require('../../models/user')
const Issue = require('../../models/issue')
const Message = require('../../models/msgStore')


const searchIssue = (req, res) => {
  const { user, searchVal } = req.body

  checkAndSend()
  async function checkAndSend() {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const result = await Issue.find({})
        if (result.length > 0) {
          let searchResult = []
          const sArray = searchVal.toLowerCase().split(' ')
          result.map(issue => {
            const { issueTitle } = issue
            const iArray = issueTitle.toLowerCase().split(' ')
            sArray.map(word => {
              const wordCond = word !== 'how' && word !== 'to'
              if (wordCond && (iArray.includes(word))) {
                searchResult = [...searchResult, issue]
              }
              return
            })
          })
          res.json({
            status: "SUCCESS",
            result: searchResult,
          })
        } else {
          res.json({
            status: "FAILED",
            message: "No issues related to this domain"
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
module.exports = searchIssue