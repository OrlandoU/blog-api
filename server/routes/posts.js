var express = require('express')
var router = express.Router()
var postsController = require('../controllers/postsController')

//Get list of posts
router.get('/', postsController.posts_get)

//Create post
router.post('/', postsController.post_post)

//Get posts
router.get('/:postid', postsController.post_get)

//Update Post
router.put('/:postid', postsController.post_put)

//Delete Post
router.delete('/:postid', postsController.post_delete)

//Get comments under a post
router.get('/:postid/comments', postsController.comments_get)

//Delete all comments under post
router.delete('/:postid/comments')

//Delete comment
router.delete('/:postid/comments/:commentid')

module.exports = router