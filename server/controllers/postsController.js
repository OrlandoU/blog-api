const Post = require('../models/post')
const Comments = require('../models/comment')
const { body, validationResult } = require('express-validator')

exports.posts_get = async (req, res, next) => {
    const { sort } = req.query
    const posts = await Post.find().sort(sort ? { [sort]: sort[0] == '-' ? -1 : 1 } : null)

    res.json({
        posts,
        results: posts.length
    })
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
        .isAlphanumeric()
        .withMessage('Title contains non-alphanumeric characters')
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.sendStatus(400)
        }
        try {
            const post = new Post({
                content: req.body.content,
                title: req.body.title
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
        .isAlphanumeric()
        .withMessage('Title contains non-alphanumeric characters')
    , async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.sendStatus(400)
        }
        try {
            const updatedPost = new Post({
                _id: req.params.postid,
                content: req.body.content,
                title: req.body.title
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
        res.json(removedPost)
    } catch (error) {
        next(error)
    }
}

exports.comments_get = async (req, res, next) => {
    try {
        const comments = await Comments.find({ post: req.params.postid })
        res.json({
            comments,
            results: comments.length
        })
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
            res.sendStatus(400)
        }

        try {
            const post = await Post.findById(req.params.postid)

            if (!post) {
                res.status(404).send('The requested post does not exist')
            }

            const comment = new Comment({
                content: req.body.content
            })

            await comment.save()
            
            res.json(comment)
        } catch (error) {
            next(error)
        }
    }
]

exports.comment_delete = async (req, res, next) => {
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
