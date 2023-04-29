var mongoose = require('mongoose')
var Schema = mongoose.Schema

const postSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    cover: {type: String},
    update_date: {type: Schema.Types.Date},
    isPublished: {type: Boolean, default: false},
    create_date: {type: Schema.Types.Date, default: Date.now}
})

module.exports = mongoose.model('Post', postSchema)