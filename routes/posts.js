var express = require('express')
var router = express.Router()
var postsController = require('../controllers/postsController')
var passport = require('passport')

//Get list of posts
router.get('/', postsController.posts_get)

//Create post
router.post('/', passport.authenticate('jwt', {session: false}),postsController.post_post)

//Get posts
router.get('/:postid', postsController.post_get)

//Update Post
router.put('/:postid', passport.authenticate('jwt', { session: false }), postsController.post_put)

//Delete Post
router.delete('/:postid', passport.authenticate('jwt', { session: false }), postsController.post_delete)

//Get comments under a post
router.get('/:postid/comments', postsController.comments_get)

//Create comment
router.post('/:postid/comments', passport.authenticate('jwt', { session: false }), postsController.comment_post)

//Delete all comments under post
router.delete('/:postid/comments', passport.authenticate('jwt', { session: false }), postsController.comments_delete)

//Delete comment
router.delete('/:postid/comments/:commentid', passport.authenticate('jwt', { session: false }), postsController.comment_delete)

module.exports = router