var express = require('express')
var router = express.Router()
var postsController = require('../controllers/postsController')
var passport = require('passport');
const multer = require('multer');
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage })

function validatePermission(req, res, next){
    if(req.user.isAdmin){
        next()
    } else{
        return res.sendStatus(403)
    }
}

//Get list of posts
router.get('/', postsController.posts_get)

//Create post
router.post('/', passport.authenticate('jwt', {session: false}), validatePermission, upload.single('cover'), postsController.post_post)

//Get posts
router.get('/:postid', postsController.post_get)

//Update Post
router.put('/:postid', passport.authenticate('jwt', { session: false }), validatePermission, upload.single('cover'),postsController.post_put)

//Delete Post
router.delete('/:postid', passport.authenticate('jwt', { session: false }), validatePermission, postsController.post_delete)

//Get comments under a post
router.get('/:postid/comments', postsController.comments_get)

//Create comment
router.post('/:postid/comments', passport.authenticate('jwt', { session: false }), postsController.comment_post)

//Delete all comments under post
router.delete('/:postid/comments', passport.authenticate('jwt', { session: false }), validatePermission, postsController.comments_delete)

//Delete comment
router.delete('/:postid/comments/:commentid', passport.authenticate('jwt', { session: false }), postsController.comment_delete)


module.exports = router