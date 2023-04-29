const { body, validationResult } = require('express-validator')
const User = require('../models/user')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.login = async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).send(info)
        }

        req.login(user, { session: false }, (err) => {
            if (err) {
                return res.status(400).send(err)
            }
        })
        //Create jwt token and return it with user object
        try {
            const token = jwt.sign(user.toObject(), 'boots&cats')
            return res.json({user, token})
        } catch (error) {
            res.status(500).send(error)
        }

    })(req, res, next)
}
exports.info = (req, res, next) => {
    return res.json(req.user)
}

exports.sign_up = [
    body('username')
        .trim()
        .escape()
        .isLength({ min: 1, max: 35 })
        .withMessage('Invalid username length')
        .custom(async value => {
            const user = await User.findOne({ username: value })
            if (user) {
                throw new Error('Username already in use')
            }
            return true
        })
        .isAlphanumeric()
        .withMessage('Username contains non-alphanumeric characters')
    ,
    body('password')
        .trim()
        .escape()
        .isLength({ min: 8 })
        .withMessage('Invalid password length')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
    ,
    body('email')
        .trim()
        .escape()
        .isEmail()
        .withMessage('Invalid email')
        .custom(async value => {
            const user = await User.findOne({ email: value })
            if (user) {
                throw new Error('Email already in use')
            }
            return true
        })
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors)
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            })

            await user.save()

            req.login(user, { session: false }, (err) => {
                if (err) {
                    return res.status(400).send(err)
                }
            })
            try {
                const token = jwt.sign(user.toObject(), 'boots&cats')
                return res.json({user, token})
            } catch (error) {
                res.status(500).send(error)
            }
        } catch (error) {
            next(error)
        }
    }
]