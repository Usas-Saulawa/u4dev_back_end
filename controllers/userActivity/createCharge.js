const Realm = require('../../models/realms')
const User = require('../../models/user')
const Transaction = require("../../models/transactions")
const { v4: uuidv4 } = require("uuid")
require('dotenv').config()
const Flutter = require('flutterwave-node-v3')
const offers = [
  {
    toknNo: 20,
    save: 3
  },
  {
    toknNo: 25,
    save: 5
  },
  {
    toknNo: 35,
    save: 7
  },
  {
    toknNo: 50,
    save: 11
  },
  {
    toknNo: 80,
    save: 13
  },
  {
    toknNo: 100,
    save: 15
  },
  {
    toknNo: 150,
    save: 20
  },
  {
    toknNo: 200,
    save: 25
  },
  {
    toknNo: 250,
    save: 28
  }
]

const createForChargeRequest = (req, res) => {
  const { user, offer, payWith, amount, value } = req.body
  return res.json({
    closed: true,
  })
  checkAndSend()
  async function checkAndSend() {
    try {
      const flw = new Flutter(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY)

      const inOffer = offers.filter(({ toknNo }) => toknNo == amount)
      if (inOffer.length > 0) {
        const { save } = inOffer[0]
        const perOne = process.env.TOKEN_PRICE
        const amountToPay = ((amount * perOne) / 100) * (100 - save)
        const ref_Txn = uuidv4()
        const newTran = new Transaction({
          tx_ref: ref_Txn,
          amount: amount,
          amountToPay: amountToPay,
          email: user
        })
        await newTran.save()
        if (payWith == "transfer") {
          const details = {
            tx_ref: ref_Txn,
            amount: amountToPay,
            email: user,
            currency: "NGN",
          };
          const response = await flw.Charge.bank_transfer(details)
          console.log(response)
          res.json(response)
        } else if (payWith == "ussd") {
          const details = {
            tx_ref: ref_Txn,
            amount: amountToPay,
            email: user,
            account_bank: value,
            currency: "NGN",
          };
          const response = await flw.Charge.ussd(details)
          res.json(response)

        }
      } else {
        const perOne = process.env.TOKEN_PRICE
        const amountToPay = ((amount * perOne) / 100) * 98
        const ref_Txn = uuidv4()
        const newTran = new Transaction({
          tx_ref: ref_Txn,
          amount: amount,
          amountToPay: amountToPay,
          email: user
        })
        await newTran.save()
        if (payWith == "transfer") {
          const details = {
            tx_ref: ref_Txn,
            amount: amountToPay,
            email: user,
            currency: "NGN",
          };
          const response = await flw.Charge.bank_transfer(details)
          console.log(response)
          res.json(response)
        } else if (payWith == "ussd") {
          const details = {
            tx_ref: ref_Txn,
            amount: amountToPay,
            email: user,
            account_bank: value,
            currency: "NGN",
          };
          const response = await flw.Charge.ussd(details)
          res.json(response)
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }
}
module.exports = createForChargeRequest