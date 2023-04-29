var mongoose = require('mongoose')
var Schema = mongoose.Schema

const commentSchema = new Schema({
    post: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    create_date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Comment', commentSchema)