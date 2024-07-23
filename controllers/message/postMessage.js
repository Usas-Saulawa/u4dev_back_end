const User = require('../../models/user')
const Message = require('../../models/msgStore')

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET
});


const postMessage = (req, res) => {
  const { user, message } = req.body

  checkAndSend()
  async function checkAndSend() {
    try {
      const data = await User.find({ email: user })
      if (data.length > 0) {
        const { roomID } = data[0]
        const msgData = await Message.find({ roomID })
        if (msgData.length > 0) {
          const { messages } = msgData[0]
          let messageToSend = []
          messages.map(({ role, content, date }) => {
            if ((date + 300000) < Date.now()) return
            messageToSend.push({ role, content })
          })
          const newMessage = { role: "user", content: message, date: Date.now() }
          const updated = [...messages, newMessage]
          await Message.updateOne({ roomID }, { messages: updated })
          messageToSend = [...messageToSend, { role: "user", content: message }]
          return
          const completion = await openai.chat.completions.create({
            messages: messageToSend,
            model: "gpt-3.5-turbo",
          });

          const completionText = completion.choices[0].message.content
          console.log(completion.choices[0]);
          const botMessage = { role: "assistant", content: completionText, date: Date.now() }
          const updatedMessages = [...messages, botMessage]
          await Message.updateOne({ roomID }, { messages: updatedMessages })
          res.json({
            message: botMessage
          })
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
module.exports = postMessage