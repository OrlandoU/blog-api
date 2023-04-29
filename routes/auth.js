var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')
var passport = require('passport')

router.post('/login', authController.login)

router.get('/info', passport.authenticate('jwt', {session: false}), authController.info)

router.post('/sign-up', authController.sign_up)


module.exports = router