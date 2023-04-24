const passport = require('passport')
const jwt = require('jsonwebtoken')

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
        try {
            const token = jwt.sign(user.toObject(), 'boots&cats')
            return res.json({ token, user })
        } catch (error) {
            res.status(500).send(error)
        }

    })(req, res, next)
}

