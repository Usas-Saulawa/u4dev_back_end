// importing express js
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const Flutter = require("flutterwave-node-v3")


// importing the database connection
require('./config/database')
require('dotenv').config()

//importing the router
const userRoute = require('./routes/usersRoute')
const resourceRoute = require('./routes/resourceRoute')
const activityRoute = require('./routes/activityRoute')

const Transaction = require("./models/transactions")
const User = require("./models/user")

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors())
app.use(express.static("public"))
app.use(helmet({
  contentSecurityPolicy: false
}))
app.use(xss())
app.use(mongoSanitize())
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/user', userRoute)
app.use('/resource', resourceRoute)
app.use('/activity', activityRoute)

app.post("/user/auto/course/payment", async (req, res) => {
  const { authReq } = req.query
  try {
    const flw = new Flutter(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KET)
    const secretHash = process.env.SECRET_HASH;
    const AUTH_REQ = process.env.AUTH_REQ
    const signature = req.headers["verif-hash"];
    if (!signature || signature !== secretHash) {
      return res.status(401).end();
    }
    if (!authReq || authReq !== AUTH_REQ) {
      return res.status(401).end();
    }

    const payload = req.body;
    console.log(payload);
    const existingEvent = await flw.Transaction.fetch({ tx_ref: payload.data.tx_ref });
    // n.b. the Transaction.fetch method is from the Node v3 library.

    if (existingEvent.status === payload.status) {
      // The status hasn't changed so it's a duplicate, discard
      res.status(200).end();
    } else {
      const { event, data } = payload
      if (data.status === "successful") {
        const transact = await Transaction.find({ tx_ref: data.tx_ref })
        if (transact.length > 0) {
          const { amount, amountToPay, email, tx_ref } = transact[0]
          if (Number(amountToPay) == Number(data.amount) && email === data.customer.email) {
            const userData = await User.find({ email })
            if (userData.length > 0) {
              const { tokens } = userData[0]
              await User.updateOne({ email }, { tokens: Number(amount + tokens) })
              await Transaction.deleteOne({ tx_ref })
            }
          }
        }
      }
    }
    res.status(200).end();

  } catch (err) {
    console.log(err.code);
    console.log(err.response.body);
  }
})
app.get(`/payment/:ref`, (req, res) => {
  const { ref } = req.params
  console.log(ref)
  checkAndRespond()
  async function checkAndRespond() {
    try {
      const tranDat = await Transaction.find({ tx_ref: ref })
      if (tranDat.length > 0) {
        const { email, amountToPay, tx_ref } = tranDat[0]
        res.sendFile(__dirname + '/public/payment.html')
      } else {
        res.sendStatus(401)
      }
    } catch (error) {
      console.log(error)
    }
  }

})

app.get('/download/u4dev.apk', (req, res) => {
  try {
    res.download(path.join(__dirname, "/u4dev.apk"))
  } catch (error) {
    console.log(error)
  }
})

app.get('/readable/download/:book', (req, res) => {
  try {
    const { book } = req.params
    res.download(path.join(path.resolve(__dirname, `/readable/${book}`)))
  } catch (error) {
    console.log(error)
  }
})
app.get('/', (req, res) => {
  res.sendFile(path.join(path.resolve(__dirname, "public", "index.html")))
})
app.listen(5000, () => {
  console.log('Server is active')
})