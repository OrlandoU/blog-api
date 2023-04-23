var mongoose = require('mongoose')
var Schema = mongoose.Schema

const userSchema = new Schema({
    first_name: { type: String, maxLength: 35, required: true },
    last_name: { type: String, maxLength: 35, required: true },
    password: { type: String, minLength: 8 },
    email: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
})

module.exports = mongoose.model('User', userSchema)