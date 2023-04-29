const Post = require('../models/post')
const Comments = require('../models/comment')
const { body, validationResult } = require('express-validator')
var fsP = require('fs/promises')
var fs = require('fs')


exports.posts_get = async (req, res, next) => {
    const { sort, ...queries } = req.query
    const posts = await Post.find(queries).sort(sort ? { [sort]: sort[0] == '-' ? -1 : 1 } : null)

    res.json(posts)
}

exports.post_post = [
    body('content')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Content Invalid Length')
    ,
    body('title')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid title length')
    ,
    body('cover')
        .optional({ checkFalsy: true })
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.sendStatus(400)
        }
        try {
            const post = new Post({
                content: req.body.content,
                title: req.body.title,
                cover: req.file ? req.file.filename : ''
            })

            await post.save()

            return res.json(post)
        } catch (error) {
            return next(error)
        }

    }
]

exports.post_get = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postid)
        res.json(post)
    } catch (error) {
        next(error)
    }
}

exports.post_put = [
    body('content')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Content Invalid Length')
    ,
    body('title')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Invalid title length')
    ,
    body('isPublished')
        .optional({ checkFalsy: true })
        .isBoolean()
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send(errors)
        }
        try {
            console.log(req.body)
            const oldPost = await Post.findById(req.params.postid)
            if (req.body.cover == 'none' && oldPost.cover !== '') {
                const filepath = oldPost.cover
                const path = './uploads/' + filepath
                if (fs.existsSync(path)) {
                    await fsP.unlink(path)
                }
            }
            const updatedPost = new Post({
                _id: req.params.postid,
                content: req.body.content ? req.body.content : oldPost.content,
                title: req.body.title ? req.body.title : oldPost.title,
                cover: req.body.cover == 'none' ? '' : req.file ? req.file.filename : oldPost.cover,
                isPublished: typeof req.body.isPublished == 'boolean' ? req.body.isPublished : oldPost.isPublished
            })

            const post = await Post.findByIdAndUpdate(req.params.postid, updatedPost, { new: true })
            res.json(post)
        } catch (error) {
            next(error)
        }
    }
]

exports.post_delete = async (req, res, next) => {
    try {

        await Comments.deleteMany({ post: req.params.postid })
        const removedPost = await Post.findByIdAndRemove(req.params.postid)
        const filepath = removedPost.cover
        if (filepath !== '') {
            const path = './uploads/' + filepath
            if (fs.existsSync(path)) {
                await fsP.unlink(path)
            }
        }
        res.json(removedPost)
    } catch (error) {
        next(error)
    }
}

exports.comments_get = async (req, res, next) => {
    try {
        const comments = await Comments.find({ post: req.params.postid }).populate('author').sort({ create_date: -1 })
        res.json(comments)
    } catch (error) {
        next(error)
    }
}
exports.comment_post = [
    body('content')
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('Content Invalid Length')
    ,
    async (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.sendStatus(400)
        }

        try {
            const post = await Post.findById(req.params.postid)

            if (!post) {
                res.status(404).send('The requested post does not exist')
            }

            const comment = new Comments({
                author: req.user._id,
                post: req.params.postid,
                content: req.body.content
            })

            await comment.save()
            return res.json(await comment.populate('author'))
        } catch (error) {
            next(error)
        }
    }
]

exports.comment_delete = async (req, res, next) => {
    const comment = await Comments.findById(req.params.id)
    if (!comment.author.equals(req.user._id) && !req.user.isAdmin) {
        return res.sendStatus(403)
    }
    try {
        const removedComment = await Comments.findByIdAndRemove(req.params.postid)
        res.json(removedComment)
    } catch (error) {
        next(error)
    }
}

exports.comments_delete = async (req, res, next) => {
    try {
        await Comments.deleteMany({ post: req.params.postid })
        res.sendStatus(200)
    } catch (error) {
        next(error)
    }
}

exports.post_publish = async (req, res, next) => {

}

exports.post_unpublish = async (req, res, next) => {

}