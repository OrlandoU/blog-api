var mongoose = require('mongoose')
var Schema = mongoose.Schema

const commentSchema = new Schema({
    post: {type: Schema.Types.ObjectId, ref: 'Post'},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
})

module.exports = mongoose.model('Comment', commentSchema)