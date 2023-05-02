const initializeMongoServer = require('../mongoConfigTesting')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var passportjwt = require('passport-jwt')
var JWTStrategy = passportjwt.Strategy
var ExtractJwt = passportjwt.ExtractJwt
const express = require('express')
const User = require('../models/user')

const postsRouter = require('../routes/posts')
const authRouter = require('../routes/auth')
const bcrypt = require('bcryptjs')
const app = express()

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return done(null, false, { message: 'Incorrect username' })
        }
       bcrypt.compare(password, user.password, (err, result) => {
            if (err || !result) {
                return done(err, false, { message: 'Incorrect password' })
            }
            return done(null, user)
        })

    } catch (error) {
        done(error)
    }
}))

//Jwt Authentication Strategy
passport.use(new JWTStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: 'boots&cats' }, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload._id)
        done(null, user)
    } catch (error) {
        done(error)
    }
}))

initializeMongoServer()
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/auth', authRouter)
app.use('/posts', postsRouter);

module.exports = app