var mongoose = require('mongoose')
var Schema = mongoose.Schema

const postSchema = new Schema({
    content: {type: String, required: true},
    update_date: {type: Schema.Types.Date},
    create_date: {type: Schema.Types.Date, default: Date.now}
})

module.exports = mongoose.model('Post', postSchema)