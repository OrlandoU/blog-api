var mongoose = require('mongoose')
var Schema = mongoose.Schema

const userSchema = new Schema({
    username: { type: String, maxLength: 35, required: true },
    password: { type: String, minLength: 8, required: true },
    email: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
})

module.exports = mongoose.model('User', userSchema)