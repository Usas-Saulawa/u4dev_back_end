const logUser = require('../controllers/users/logUser')
const signUser = require('../controllers/users/signUser')

const router = require('express').Router()

router.post('/login', logUser)
router.post('/signup', signUser)

module.exports = router