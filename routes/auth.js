var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')
var passport = require('passport')

router.post('/login', authController.login)

router.post('/sign-up')


module.exports = router